import type { UserOperation } from "permissionless";
import {
	http,
	createWalletClient,
	createPublicClient,
	defineChain,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import type { UserOperationV6, UserOperationV7 } from "./schema";

// Type predicate to check if the UserOperation is V07.
export function isVersion07(
	operation: UserOperationV6 | UserOperationV7,
): operation is UserOperation<"v0.7"> {
	return (
		"factory" in operation ||
		"paymaster" in operation ||
		"factoryData" in operation
	);
}

// Type predicate check if the UserOperation is V06.
export function isVersion06(
	operation: UserOperationV6 | UserOperationV7,
): operation is UserOperation<"v0.6"> {
	return "initCode" in operation || "paymasterAndData" in operation;
}

export const getChain = async () => {
	const tempClient = createPublicClient({
		transport: http(process.env.ANVIL_RPC),
	});

	const chain = defineChain({
		id: await tempClient.getChainId(),
		name: "chain",
		nativeCurrency: {
			name: "ETH",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: [],
				webSocket: undefined,
			},
		},
	});

	return chain;
};

export const getAnvilWalletClient = async () => {
	const account = mnemonicToAccount(
		"test test test test test test test test test test test junk",
		{
			/* avoid nonce error with index 0 when deploying ep contracts. */
			addressIndex: 1,
		},
	);

	const walletClient = createWalletClient({
		account,
		transport: http(process.env.ANVIL_RPC),
		chain: await getChain(),
	});

	return walletClient;
};
