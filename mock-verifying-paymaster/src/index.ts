import { paymaster } from "@pimlico/mock-paymaster";

const main = async () => {
	const anvilRpc = process.env.ANVIL_RPC as string;
	const altoRpc = process.env.ALTO_RPC as string;
	const port = Number(process.env.PORT ?? 3000);

	const server = paymaster({
		host: "0.0.0.0",
		anvilRpc,
		port,
		altoRpc,
	});

	await server.start();
	console.log(`Started paymaster server on port ${port}`);

	server.on("stderr", (data) => {
		console.error(data.toString());
	});
	server.on("stdout", (data) => {
		console.log(data.toString());
	});
};

main();
