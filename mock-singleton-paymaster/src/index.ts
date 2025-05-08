import cors from "@fastify/cors";
import Fastify from "fastify";
import { http, createPublicClient } from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { foundry } from "viem/chains";
import { deployErc20Token } from "./helpers/erc20-utils.js";
import { getAnvilWalletClient } from "./helpers/utils.js";
import { createRpcHandler } from "./relay.js";
import { deployPaymasters } from "./singletonPaymasters.js";

const main = async () => {
	const app = Fastify({});
	const anvilRpc = process.env.ANVIL_RPC as string;
	const altoRpc = process.env.ALTO_RPC as string;

	const walletClient = getAnvilWalletClient({
		anvilRpc,
		addressIndex: 1,
	});
	const publicClient = createPublicClient({
		transport: http(anvilRpc),
		chain: foundry,
	});
	const bundler = createBundlerClient({
		chain: foundry,
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

	await app.listen({ host: "localhost", port: 3000 });
};

main();
