# mock-aa-setup
Docker containers to hold mock singleton paymaster + helpers to setup local AA environment

## Setup

Run `docker-compose up -d` to start the containers.

## Contract Deployments

This environment will deploy the following contracts:

```
"0x4e59b44847b379578588920ca78fbf26c0b4956c", // Determinstic deployer
"0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7", // Safe Singleton Factory
"0x988C135a1049Ce61730724afD342fb7C56CD2776", // Biconomy Singleton Factory
"0x4337084d9e255ff0702461cf8895ce9e3b5ff108", // EntryPoint v0.8
"0x13E9ed32155810FDbd067D4522C492D6f68E5944", // Simple Account Factory V0.8
"0x0000000071727De22E5E9d8BAf0edAc6f37da032", // EntryPoint v0.7
"0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985", // Simple Account Factory V0.7
"0x74Cb5e4eE81b86e70f9045036a1C5477de69eE87", // EntryPoint Simulations (Needed for v0.7)
"0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47", // Safe V0.7 Module Setup
"0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226", // Safe V0.7 4337 Module
"0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb", // Safe V0.6 Module Setup
"0xa581c4A4DB7175302464fF3C06380BC3270b4037", // Safe V0.6 4337 Module
"0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67", // Safe Proxy Factory
"0x41675C099F32341bf84BFc5382aF534df5C7461a", // Safe Singleton
"0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526", // Safe Multi Send
"0x9641d764fc13c8B624c04430C7356C1C7C8102e2", // Safe Multi Send Call Only
"0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // EntryPoint V0.6
"0x9406Cc6185a346906296840746125a0E44976454", // Simple Account Factory V0.6
"0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e", // Biconomy ECDSA Ownership Registry Module
"0x0000002512019Dafb59528B82CB92D3c5D2423ac", // Biconomy Account Logic V0.2
"0x000000a56Aaca3e9a4C479ea6b6CD0DbcB6634F5", // Biconomy Factory Address
"0x0bBa6d96BD616BedC6BFaa341742FD43c60b83C1", // Biconomy Default Fallback Handler
"0xd9AB5096a832b9ce79914329DAEE236f8Eea0390", // Kernel v0.2.2 ECDSA Valdiator
"0x0DA6a956B9488eD4dd761E59f52FDc6c8068E6B5", // Kernel v0.2.2 Account Logic
"0x5de4839a76cf55d0c90e2061ef4386d962E15ae3", // Kernel v0.2.2 Factory
"0x8104e3Ad430EA6d354d013A6789fDFc71E671c43", // Kernel v0.3.0 ECDSA Valdiator
"0x94F097E1ebEB4ecA3AAE54cabb08905B239A7D27", // Kernel v0.3.0 Account Logic
"0x6723b44Abeec4E71eBE3232BD5B455805baDD22f", // Kernel v0.3.0 Factory
"0xd703aaE79538628d27099B8c4f621bE4CCd142d5", // Kernel v0.3.0 Meta Factory
"0xBAC849bB641841b44E965fB01A4Bf5F074f84b4D", // Kernel v0.3.1 Account Logic
"0xaac5D4240AF87249B3f71BC8E4A2cae074A3E419", // Kernel v0.3.1 Factory
"0xd703aaE79538628d27099B8c4f621bE4CCd142d5", // Kernel v0.3.1 Meta Factory
"0x00004EC70002a32400f8ae005A26081065620D20", // LightAccountFactory v1.1.0
"0xae8c656ad28F2B59a196AB61815C16A0AE1c3cba", // LightAccount v1.1.0 implementation
```
