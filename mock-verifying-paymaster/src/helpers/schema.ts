import { type Hex, getAddress, pad } from "viem";
import { z, type infer as zodInfer } from "zod";

export enum ValidationErrors {
	InvalidFields = -32602,
	InsufficientBalance = -32603,
	UnsupportedEntryPoint = -32604,
}

export class InternalBundlerError extends Error {
	constructor(msg?: string) {
		let message = msg;
		if (!msg) {
			message = "Internal error from bundler";
		}
		super(message);
	}
}

export class RpcError extends Error {
	// error codes from: https://eips.ethereum.org/EIPS/eip-1474
	constructor(
		msg: string,
		readonly code?: number,
		readonly data: unknown = undefined,
	) {
		super(msg);
	}
}

const hexDataPattern = /^0x[0-9A-Fa-f]*$/;
const addressPattern = /^0x[0-9,a-f,A-F]{40}$/;

export const addressSchema = z
	.string()
	.regex(addressPattern, { message: "not a valid hex address" })
	.transform((val) => getAddress(val));

export const hexNumberSchema = z
	.string()
	.regex(hexDataPattern)
	.or(z.number())
	.or(z.bigint())
	.superRefine((data, ctx) => {
		// This function is used to refine the input and provide a context where you have access to the path.
		try {
			BigInt(data); // Attempt to convert to BigInt to validate it can be done
		} catch {
			ctx.addIssue({
				code: "custom",
				message:
					"Invalid input, expected a value that can be converted to bigint.",
			});
		}
	})
	.transform((val) => BigInt(val));

export const hexDataSchema = z
	.string()
	.regex(hexDataPattern, { message: "not valid hex data" })
	.transform((val) => val.toLowerCase() as Hex);

const signedAuthorizationSchema = z.union([
	z.object({
		contractAddress: addressSchema,
		chainId: hexNumberSchema.transform((val) => Number(val)),
		nonce: hexNumberSchema.transform((val) => Number(val)),
		r: hexDataSchema.transform((val) => val as Hex),
		s: hexDataSchema.transform((val) => val as Hex),
		v: hexNumberSchema.optional(),
		yParity: hexNumberSchema.transform((val) => Number(val)),
	}),
	z.object({
		address: addressSchema,
		chainId: hexNumberSchema.transform((val) => Number(val)),
		nonce: hexNumberSchema.transform((val) => Number(val)),
		r: hexDataSchema.transform((val) => val as Hex),
		s: hexDataSchema.transform((val) => val as Hex),
		v: hexNumberSchema.optional(),
		yParity: hexNumberSchema.transform((val) => Number(val)),
	}),
]);

const partialAuthorizationSchema = z.union([
	z.object({
		contractAddress: addressSchema,
		chainId: hexNumberSchema
			.optional()
			.transform((val) => (val ? Number(val) : 1)),
		nonce: hexNumberSchema
			.optional()
			.transform((val) => (val ? Number(val) : 0)),
		r: hexDataSchema
			.optional()
			.transform((val) => (val as Hex) ?? pad("0x", { size: 32 })),
		s: hexDataSchema
			.optional()
			.transform((val) => (val as Hex) ?? pad("0x", { size: 32 })),
		v: hexNumberSchema.optional(),
		yParity: hexNumberSchema
			.optional()
			.transform((val) => (val ? Number(val) : 0)),
	}),
	z.object({
		address: addressSchema,
		chainId: hexNumberSchema
			.optional()
			.transform((val) => (val ? Number(val) : 1)),
		nonce: hexNumberSchema
			.optional()
			.transform((val) => (val ? Number(val) : 0)),
		r: hexDataSchema
			.optional()
			.transform((val) => (val as Hex) ?? pad("0x", { size: 32 })),
		s: hexDataSchema
			.optional()
			.transform((val) => (val as Hex) ?? pad("0x", { size: 32 })),
		v: hexNumberSchema.optional(),
		yParity: hexNumberSchema
			.optional()
			.transform((val) => (val ? Number(val) : 0)),
	}),
]);

const userOperationSchemaPaymasterV6 = z
	.object({
		sender: addressSchema,
		nonce: hexNumberSchema,
		initCode: hexDataSchema,
		callData: hexDataSchema,
		callGasLimit: hexNumberSchema.default(1n),
		verificationGasLimit: hexNumberSchema.default(1n),
		preVerificationGas: hexNumberSchema.default(1n),
		maxPriorityFeePerGas: hexNumberSchema,
		maxFeePerGas: hexNumberSchema,
		paymasterAndData: z
			.union([hexDataSchema, z.literal("")])
			.optional()
			.transform((val) => {
				if (val === "" || val === undefined) {
					return "0x";
				}
				return val;
			}),
		signature: z
			.union([hexDataSchema, z.literal("")])
			.optional()
			.transform((val) => {
				if (val === "" || val === undefined) {
					return "0x";
				}
				return val;
			}),
		eip7702Auth: signedAuthorizationSchema.optional().nullable(),
	})
	.strict()
	.transform((val) => val);

const userOperationSchemaPaymasterV7 = z
	.object({
		sender: addressSchema,
		nonce: hexNumberSchema,
		factory: addressSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		factoryData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		callData: hexDataSchema,
		callGasLimit: hexNumberSchema.default(1n),
		verificationGasLimit: hexNumberSchema.default(1n),
		preVerificationGas: hexNumberSchema.default(1n),
		maxFeePerGas: hexNumberSchema,
		maxPriorityFeePerGas: hexNumberSchema,
		paymaster: addressSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		paymasterVerificationGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		paymasterPostOpGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		paymasterData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		signature: hexDataSchema.optional().transform((val) => {
			if (val === undefined) {
				return "0x";
			}
			return val;
		}),
		eip7702Auth: signedAuthorizationSchema.optional().nullable(),
	})
	.strict()
	.transform((val) => val);

const userOperationSchemaPaymasterV8 = z
	.object({
		sender: addressSchema,
		nonce: hexNumberSchema,
		factory: z
			.union([addressSchema, z.literal("0x7702")])
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		factoryData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		callData: hexDataSchema,
		callGasLimit: hexNumberSchema.default(1n),
		verificationGasLimit: hexNumberSchema.default(1n),
		preVerificationGas: hexNumberSchema.default(1n),
		maxFeePerGas: hexNumberSchema,
		maxPriorityFeePerGas: hexNumberSchema,
		paymaster: addressSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		paymasterVerificationGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		paymasterPostOpGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		paymasterData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? undefined),
		signature: hexDataSchema.optional().transform((val) => {
			if (val === undefined) {
				return "0x";
			}
			return val;
		}),
		eip7702Auth: signedAuthorizationSchema.optional().nullable(),
	})
	.strict()
	.transform((val) => {
		return val;
	});

export const jsonRpcResultSchema = z
	.object({
		jsonrpc: z.literal("2.0"),
		id: z.number(),
		result: z.unknown(),
	})
	.strict();

export const jsonRpcSchema = z
	.object({
		jsonrpc: z.literal("2.0"),
		id: z.number(),
		method: z.string(),
		params: z.array(z.unknown()).optional().default([]),
	})
	.strict();

const eip7677UserOperationSchemaV6 = z
	.object({
		sender: addressSchema,
		nonce: hexNumberSchema,
		initCode: hexDataSchema,
		callData: hexDataSchema,
		callGasLimit: hexNumberSchema,
		verificationGasLimit: hexNumberSchema,
		preVerificationGas: hexNumberSchema,
		maxPriorityFeePerGas: hexNumberSchema,
		maxFeePerGas: hexNumberSchema,
		paymasterAndData: hexDataSchema
			.nullable()
			.optional()
			.transform((_) => {
				return "0x" as Hex;
			}),
		signature: hexDataSchema
			.nullable()
			.optional()
			.transform((_) => {
				return "0x" as Hex;
			}),
		eip7702Auth: signedAuthorizationSchema.optional().nullable(),
	})
	.strict()
	.transform((val) => {
		return val;
	});

const eip7677UserOperationSchemaV7 = z
	.object({
		sender: addressSchema,
		nonce: hexNumberSchema,
		factory: addressSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		factoryData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		callData: hexDataSchema,
		callGasLimit: hexNumberSchema,
		verificationGasLimit: hexNumberSchema,
		preVerificationGas: hexNumberSchema,
		maxFeePerGas: hexNumberSchema,
		maxPriorityFeePerGas: hexNumberSchema,
		paymaster: addressSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		paymasterVerificationGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		paymasterPostOpGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		paymasterData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		signature: hexDataSchema.optional().transform((val) => {
			if (val === undefined) {
				return "0x";
			}
			return val;
		}),
		eip7702Auth: signedAuthorizationSchema.optional().nullable(),
	})
	.strict()
	.transform((val) => {
		return val;
	});

const eip7677UserOperationSchemaV8 = z
	.object({
		sender: addressSchema,
		nonce: hexNumberSchema,
		factory: z
			.union([addressSchema, z.literal("0x7702")])
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		factoryData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		callData: hexDataSchema,
		callGasLimit: hexNumberSchema,
		verificationGasLimit: hexNumberSchema,
		preVerificationGas: hexNumberSchema,
		maxFeePerGas: hexNumberSchema,
		maxPriorityFeePerGas: hexNumberSchema,
		paymaster: addressSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		paymasterVerificationGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		paymasterPostOpGasLimit: hexNumberSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		paymasterData: hexDataSchema
			.nullable()
			.optional()
			.transform((val) => val ?? null),
		signature: hexDataSchema.optional().transform((val) => {
			return val ?? "0x";
		}),
		eip7702Auth: partialAuthorizationSchema.optional().nullable(),
	})
	.strict()
	.transform((val) => val);

const eip7677UserOperationSchema = z.union([
	eip7677UserOperationSchemaV6,
	eip7677UserOperationSchemaV7,
	eip7677UserOperationSchemaV8,
]);

const userOperationSchemaPaymaster = z.union([
	userOperationSchemaPaymasterV6,
	userOperationSchemaPaymasterV7,
	userOperationSchemaPaymasterV8,
]);

const paymasterContextSchema = z.union([
	z.object({ token: addressSchema }),
	z.object({
		sponsorshipPolicyId: z.string().optional(),
		validForSeconds: z.number().optional(),
		meta: z.record(z.string(), z.string()).optional(),
	}),
	z.null(),
]);

export const pmSponsorUserOperationParamsSchema = z
	.union([
		z.tuple([userOperationSchemaPaymaster, addressSchema]),
		z.tuple([
			userOperationSchemaPaymaster,
			addressSchema,
			paymasterContextSchema.nullable(),
		]),
	])
	.transform((val) => {
		return [val[0], val[1], val[2] ?? null] as const;
	});

export const pmGetPaymasterData = z
	.union([
		z.tuple([
			eip7677UserOperationSchema,
			addressSchema,
			hexNumberSchema,
			paymasterContextSchema.nullable(),
		]),
		z.tuple([eip7677UserOperationSchema, addressSchema, hexNumberSchema]),
	])
	.transform((val) => {
		return [val[0], val[1], val[2], val[3] ?? null] as const;
	});

export const pmGetPaymasterStubDataParamsSchema = z
	.union([
		z.tuple([
			eip7677UserOperationSchema,
			addressSchema,
			hexNumberSchema,
			paymasterContextSchema.nullable(),
		]),
		z.tuple([eip7677UserOperationSchema, addressSchema, hexNumberSchema]),
	])
	.transform((val) => {
		return [val[0], val[1], val[2], val[3] ?? null] as const;
	});

export const pimlicoGetTokenQuotesSchema = z.tuple([
	z.object({
		tokens: z.array(addressSchema),
	}),
	addressSchema, // entryPoint
	hexNumberSchema,
]);

export type JsonRpcSchema = zodInfer<typeof jsonRpcSchema>;
