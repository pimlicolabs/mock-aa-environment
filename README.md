# mock-aa-environment

Docker containers to hold mock verifying paymaster + helpers to setup a local AA environment.

## Usage

Start the environment:

```bash
docker compose up
```

Shutdown the environment:

```bash
docker compose down
```

## Paymaster Smart Contract

This mock paymaster is an "approve all" paymaster that does not perform any signature validations (i.e. it approves any user operation). It's located in the `mock-verifying-paymaster/contracts` directory. It's compiled using hardhat during the build of the `mock-verifying-paymaster` image.

To use your own custom contract, place it in the `mock-verifying-paymaster/contracts` directory and rebuild the `mock-verifying-paymaster` image. You'll need to fund the contract on the EntryPoint in order to use it.

A reference of how to fund the contract can be found in the `mock-verifying-paymaster/src/helpers/verifyingPaymasters.ts` file in the `setupSbcPaymasterV07` function.

## Acknowledgements

Special thanks to the Pimlico team for having the original setup of the AA environment, including images of Anvil node and their own Alto bundler.
