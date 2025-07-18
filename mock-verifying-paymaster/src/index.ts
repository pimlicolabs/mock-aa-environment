import { paymaster } from "@pimlico/mock-paymaster";
import { createServer } from "prool";

const main = async () => {
	const anvilRpc = process.env.ANVIL_RPC as string;
	const altoRpc = process.env.ALTO_RPC as string;
	const port = Number(process.env.PORT ?? 3000);

	console.log(`Starting paymaster server on port ${port}`);

	const server = createServer({
		instance: paymaster({
			host: "0.0.0.0",
			anvilRpc,
			port,
			altoRpc,
		}),
	});

	await server.start();
	server.on("stderr", (data) => {
		console.error(data.toString());
	});
	server.on("stdout", (data) => {
		console.log(data.toString());
	});
};

main();
