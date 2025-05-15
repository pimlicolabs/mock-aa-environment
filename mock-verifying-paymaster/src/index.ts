import cors from "@fastify/cors";
import Fastify from "fastify";
import { http, createPublicClient } from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { deployErc20Token } from "./helpers/erc20-utils";
import { getAnvilWalletClient, getChain } from "./helpers/utils";
import { createRpcHandler } from "./relay";
import { deployPaymasters } from "./singletonPaymasters";

const main = async () => {
	console.log("Starting mock singleton paymaster...");
	const app = Fastify({});
	const anvilRpc = process.env.ANVIL_RPC as string;
	const altoRpc = process.env.ALTO_RPC as string;
	const chain = await getChain();

	const walletClient = await getAnvilWalletClient({
		anvilRpc,
		addressIndex: 1,
	});
	const publicClient = createPublicClient({
		transport: http(anvilRpc),
		chain,
	});
	const bundler = createBundlerClient({
		chain,
		transport: http(altoRpc),
	});

	await deployPaymasters({ walletClient, publicClient });
	await deployErc20Token(walletClient, publicClient);

	app.register(cors, {
		origin: "*",
		methods: ["POST", "GET", "OPTIONS"],
	});

	const rpcHandler = createRpcHandler({
		bundler,
		publicClient,
		paymasterSigner: walletClient,
	});
	app.post("/", {}, rpcHandler);

	app.get("/ping", async (_request, reply) => {
		return reply.code(200).send({ message: "pong" });
	});

	await app.listen({ host: "0.0.0.0", port: 3000 });
};

main();
