# Building an ETH Payment Canister on the Internet Computer: A Step-by-Step Tutorial

## Introduction

This tutorial aims to guide you through the process of building a canister on the Internet Computer that can accept and withdraw Ethereum (ETH). We'll start with a starter template and gradually add features and functionalities.

## Objective

The goal is to create a canister that:

- Accepts ETH as payment
- Allows for the withdrawal of ETH

## Prerequisites

- [DFINITY Canister SDK](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html)
- [Node.js](https://nodejs.org/en/download/)
- [Rust](https://www.rust-lang.org/tools/install)
- Basic understanding of Ethereum and smart contracts

## Step 1: Clone the Starter Repository

We'll begin by cloning the [`ic-rust-nextjs`](https://github.com/b3hr4d/ic-rust-nextjs) repository, which serves as our starter template.

### What's Inside the Starter Repository?

- [`README.md`](https://github.com/b3hr4d/ic-rust-nextjs/blob/main/README.md): Provides an overview and setup instructions.
- [`Cargo.toml`](https://github.com/b3hr4d/ic-rust-nextjs/blob/main/Cargo.toml): The manifest file for the Rust workspace.
- [`dfx.json`](https://github.com/b3hr4d/ic-rust-nextjs/blob/main/dfx.json): Configuration file for the DFINITY Canister SDK.
- [`backend/hello/src/lib.rs`](https://github.com/b3hr4d/ic-rust-nextjs/blob/main/backend/hello/src/lib.rs): The Rust code for the backend logic.
- [`src/pages/index.tsx`](https://github.com/b3hr4d/ic-rust-nextjs/blob/main/src/pages/index.tsx): The main page of the Next.js app.
- [`src/service/hello.ts`](https://github.com/b3hr4d/ic-rust-nextjs/blob/main/src/service/hello.ts): Service file to interact with the Rust backend.

### Cloning the Repository

To clone the repository, open your terminal and run:

```bash
git clone https://github.com/b3hr4d/ic-rust-nextjs.git
```

Certainly, Behrad. Here's the continuation of the README file, detailing the steps to run the project locally after cloning.

---

## Step 2: Run the Project Locally

After cloning the repository, the next step is to run the project locally to ensure everything is set up correctly. Follow the commands below based on your package manager (Yarn or npm).

### Installing Dependencies

First, let's install all the required dependencies:

```bash
yarn install:all
# or
npm run install:all
```

### Running Local Internet Computer

To start the local Internet Computer environment, run:

```bash
yarn dfx:start
# or
npm run dfx:start
```

### Deploying to the Local Internet Computer

Deploy your the backend canister to the local Internet Computer by running:

```bash
yarn deploy hello
# or
npm run deploy hello
```

### Running the Next.js App

Finally, to run the Next.js(frontend) app, execute:

```bash
yarn dev
# or
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see your app running.

![Alt text](assets/starting.png)

## Step 3: Modify the Backend for ETH Deposits

In this step, we'll modify the backend to include a function that generates a deposit principal from a canister ID. This is essential for converting SepoliaETH into ckSepoliaETH, as per the ckEth documentation.

### Installing the `b3_utils` Rust Crate

First, we need to install the [b3_utils](https://docs.rs/b3_utils/latest/b3_utils/) Rust crate. Open your `Cargo.toml` file and add the following line under `[dependencies]`:

```toml
b3_utils = "0.7.1"
```

or run this command:

```bash
cargo add b3_utils
```

### Modifying the `greet` Function

Replace the existing `greet` function with the new `deposit_principal` function:

```rust
use b3_utils::{vec_to_hex_string_with_0x, Subaccount};
use candid::Principal;

#[ic_cdk::query]
fn deposit_principal(principal: String) -> String {
    let principal = Principal::from_text(principal).unwrap();
    let subaccount = Subaccount::from_principal(principal);

    let bytes32 = subaccount.to_bytes32().unwrap();

    vec_to_hex_string_with_0x(bytes32)
}
```

#### Why This Change?

1. **Function Annotation**: We use `#[ic_cdk::query]` to indicate that this is a query method, meaning it's read-only and doesn't modify the state.

2. **Principal Conversion**: We convert the passed string into a `Principal` object, which is essential for generating a subaccount.

3. **Subaccount Generation**: We generate a `Subaccount` from the `Principal`, which is a necessary step for depositing ETH.

4. **Bytes32 Conversion**: We convert the subaccount into a bytes32 array, which is the required format for the smart contract on the Sepolia Ethereum testnet.

5. **Hex String**: Finally, we convert the bytes32 array into a hex string with a "0x" prefix, which can be used as an argument for the smart contract.

## Step 4: Deploy Backend and Update Frontend

In this step, we'll deploy the modified backend canister to a local server and update the frontend code to make use of the new `deposit_principal` function.

### Deploy the Modified Backend Canister

After making the changes to the backend, deploy the canister to your local Internet Computer environment using the following command:

```bash
yarn deploy hello
```

Note: confirm the conset with `yes` the change on the terminal.

This will deploy only the `hello` canister, which now includes the `deposit_principal` function.

### Update the Frontend Code

Navigate to the frontend code where the `useActorMethod` hook is used. This is typically found in a component file. Change the method from `"greet"` to `"deposit_principal"`:

```javascript
const { call, data, error, loading } = useActorMethod("deposit_principal")
```

#### Testing the Changes

1. **Pass the Canister ID**: Update the frontend to include an input field where you can enter the canister ID.

2. **Check the Output**: The output should be a hexadecimal string that represents the deposit principal, which can be used for depositing ETH.

![Alt text](assets/deposit_principal.png)

## Step 5: Integrate MetaMask and Call the Minter Helper Contract

In this step, we'll integrate MetaMask using the [wagmi](https://wagmi.sh) library and set up the frontend to call the minter helper contract's deposit function.

### Prerequisites

- Make sure you have the [MetaMask extension](https://metamask.io/download.html) installed in your browser.
- Create a new free account on [Alchemy](https://www.alchemy.com/). After signing up, you'll be provided with an API key.

1. **Create a `.env` File**: If you haven't already, create a `.env` file in the root directory of your project.

2. **Add Alchemy API Key**: Add the following line to your `.env` file:

   ```env
   NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key_here
   ```

   Replace `your_alchemy_api_key_here` with the API key you got from Alchemy.

### Installing `wagmi` and `viem`

First, install the `wagmi` and `viem` packages:

```bash
yarn add wagmi viem
```

### Configure `wagmi`

Create a new file `config.ts` inside the `src/service` directory and add the following code:

```javascript
import { createPublicClient, http } from "viem"
import { createConfig, sepolia } from "wagmi"

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    )
  })
})
```

### Create the `Wallet` Component

Create a new file named `Wallet.tsx` inside the `src/components` folder and add the following code:

```javascript
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

interface WalletProps {}

const Wallet: React.FC<WalletProps> = ({}) => {
  const { address } = useAccount()

  const { connect } = useConnect({
    connector: new MetaMaskConnector()
  })

  const { disconnect } = useDisconnect()

  if (address)
    return (
      <main>
        Connected to: {address}
        <br />
        <button onClick={() => disconnect()}>Disconnect</button>
      </main>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default Wallet
```

### Update `pages/index.tsx`

Finally, update your `pages/index.tsx` file and replace `<Greeting />` with the following code`:

```javascript
// ...existing imports
import Wallet from "../components/Wallet"
import { config } from "service/config"
import { WagmiConfig } from "wagmi"

function HomePage() {
  return (
    {/* ...existing components */}
    {/* <Greeting /> */}
    <WagmiConfig config={config}>
      <Wallet />
    </WagmiConfig>
    {/* ...existing components */}
  )
}
```

#### Testing the Changes

You should see a "Connect Wallet" button on your browser, similar to the screenshot below.

![Alt text](assets/connect_wallet.png)
Clicking on the button should open a MetaMask popup asking for permission to connect. After connecting, you should see your wallet address on the screen.

## Step 6: Prepare Minter Helper Contract and Enable Deposits

In this step, we'll prepare the minter helper contract for calls and enable ETH deposits through the frontend.

### Fetch Contract ABI

1. **Navigate to Etherscan**: Open the [contract page on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xb44B5e756A894775FC32EDdf3314Bb1B1944dC34#code).

2. **Copy Contract ABI**: Copy the Contract ABI from the "Contract" tab.
   ![Alt text](assets/contract_abi.png)

3. **Create `abi.json`**: Inside the `src/service` directory, create a new file named `abi.json` and paste the copied ABI.

### Create the `Deposit` Component

Create a new file named `Deposit.tsx` inside the `src/components` directory and add the following code:

```javascript
import { canisterId } from "declarations/hello"
import { useEffect, useState } from "react"
import helperAbi from "service/abi.json"
import { useActorMethod } from "service/hello"
import { parseEther } from "viem"
import { useContractWrite } from "wagmi"

interface DepositProps {}

const Deposit: React.FC<DepositProps> = ({}) => {
  const [amount, setAmount] = useState(0)

  const { data: canisterDepositAddress, call } =
    useActorMethod("deposit_principal")

  useEffect(() => {
    call(canisterId)
  }, [])

  const { data, isLoading, write } = useContractWrite({
    address: "0xb44B5e756A894775FC32EDdf3314Bb1B1944dC34",
    abi: helperAbi,
    functionName: "deposit",
    value: parseEther(amount.toString()),
    args: [canisterDepositAddress]
  })

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amount = e.target.valueAsNumber
    if (amount && amount < 0) amount = 0

    setAmount(amount)
  }

  if (isLoading) {
    return <div>Loading...</div>
  } else if (data?.hash) {
    return <div>Transaction Hash: {data.hash}</div>
  } else {
    return (
      <div>
        <input type="number" value={amount} onChange={changeHandler} />
        <button
          onClick={() =>
            write({
              args: [canisterDepositAddress]
            })
          }
        >
          Deposit
        </button>
      </div>
    )
  }
}

export default Deposit
```

#### Understanding `useContractWrite`

The `useContractWrite` hook is used to interact with Ethereum smart contracts. Here's what each parameter does:

- **`address`**: The Ethereum address of the contract you want to interact with.
- **`abi`**: The ABI (Application Binary Interface) of the contract, which is a JSON representation of the contract's methods and structures.
- **`functionName`**: The name of the function in the contract that you want to call.
- **`value`**: The amount of ETH to send along with the function call, converted to its smallest unit (wei) using `parseEther`.
- **`args`**: An array of arguments that the function takes. In this case, it's the deposit address generated by the canister.

### Update the `Wallet` Component

Add the `<Deposit />` component to the `Wallet.tsx` file, right above the "Disconnect" button:

```javascript
// ...existing code
return (
  <main>
    Connected to: {address}
    <br />
    <Deposit />
    <br />
    <button onClick={() => disconnect()}>Disconnect</button>
  </main>
)
```

#### Testing the Changes

You should have small amount of Sepolia ETH in your wallet. you can get some using this [faucet](https://sepoliafaucet.com/).

1. **Call the Deposit Function**: Use the new deposit input and button to initiate a deposit.
   ![Alt text](assets/deposit_input.png)
2. **Confirm with MetaMask**: A MetaMask popup should appear asking for confirmation to proceed with the transaction.
   ![Alt text](assets/deposit_metamask.png)
3. **Check the Output**: After confirming, you should see a transaction hash.
   ![Alt text](assets/deposit_result.png)

## Step 7: Wait for Transaction Confirmation and Verify Payment

In this step, we'll implement a mechanism to wait for transaction confirmations before verifying the payment inside the canister.

### Create the `Confirmation` Component

Create a new file named `Confirmation.tsx` inside the `src/components` directory and add the following code:

```javascript
import { Hash } from "viem"
import { useWaitForTransaction } from "wagmi"

interface ConfirmationProps {
  hash: Hash;
}

const Confirmation: React.FC<ConfirmationProps> = ({ hash }) => {
  const { data, isError, error, isLoading } = useWaitForTransaction({
    hash,
    confirmations: 6 // 6 confirmations for be sure that the transaction is confirmed
  })

  if (isError && error) {
    return <div>Transaction error {error.toString()}</div>
  } else if (isLoading) {
    return <div>Waiting for confirmation…</div>
  } else if (data) {
    return <div>Transaction Status: {data.status}</div>
  } else {
    return null
  }
}

export default Confirmation
```

#### Understanding `useWaitForTransaction`

The `useWaitForTransaction` hook is used to wait for a specified number of confirmations for a given Ethereum transaction hash. Here's what each parameter does:

- **`hash`**: The transaction hash for which you are waiting for confirmations.

- **`confirmations`**: The number of confirmations to wait for before considering the transaction as confirmed. The default is 1, but in this example, we set it to 6 for added security.

### Update the `Deposit` Component

Replace the line that shows the transaction hash with the `Confirmation` component:

Change this:

```javascript
return <div>Transaction Hash: {data.hash}</div>
```

To this:

```javascript
return <Confirmation hash={data.hash} />
```

#### Testing the Changes

1. **Send Another Transaction**: Initiate another deposit transaction.

2. **Check the Output**: You should see the confirmation process in action. Once the specified number of confirmations is reached, the transaction status will be displayed.
   ![Alt text](assets/confirmation.png)

## Step 8: Verify Transaction On-Chain Inside the Canister

In this step, we'll verify the Ethereum transaction on-chain by calling the Ethereum JSON-RPC API from within the canister.

### Create Rust Structs for API Response

1. **Copy API Response**: Copy the API response from the [eth_getTransactionReceipt](https://docs.alchemy.com/reference/eth-gettransactionreceipt-base) documentation.
   ![Alt text](assets/copy_response.png)
2. **Generate Rust Structs**: Paste the copied response into this [online converter](https://transform.tools/json-to-rust-serde) to generate Rust structs.
   ![Alt text](assets/json_to_serde.png)
3. **Save the File**: Save the generated code in a new file named `receipt.rs` inside the `backend/hello` directory.

### Add Dependencies

Add the following dependencies to your `Cargo.toml`:

```toml
serde = "1.0"
serde_json = "1.0"
serde_derive = "1.0"
```

### Create the `eth_get_transaction_receipt` Function

Here's the code snippet for the function:

```rust
mod receipt;
use serde_json::json;
use b3_utils::outcall::{HttpOutcall, HttpOutcallResponse};

async fn eth_get_transaction_receipt(hash: String) -> Result<receipt::Root, String> {
    let rpc = json!({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "eth_getTransactionReceipt",
        "params": [hash]
    });

    let request = HttpOutcall::new(&RPC_URL)
        .post(&rpc.to_string(), Some(2048))
        .send_with_closure(|response: HttpOutcallResponse| HttpOutcallResponse {
            status: response.status,
            body: response.body,
            ..Default::default()
        });

    match request.await {
        Ok(response) => {
            if response.status != 200 {
                return Err(format!("Error: {}", response.status));
            }

            let trasnaction = serde_json::from_slice::<receipt::Root>(&response.body)
                .map_err(|e| format!("Error: {}", e.to_string()))?;

            Ok(trasnaction)
        }
        Err(m) => Err(format!("Error: {}", m)),
    }
}
```

#### Understanding the Function

The function `eth_get_transaction_receipt` performs the following tasks:

- **Prepare the JSON-RPC Payload**: It prepares the JSON-RPC payload using the `serde_json::json!` macro.

- **Make the HTTP Outcall**: It uses the `HttpOutcall` struct from `b3_utils` to make an HTTP POST request to the Ethereum JSON-RPC API.

- **Handle the Response**: It handles the API response, deserializes it into the `receipt::Root` struct, and returns it.

### Test the Function Using Candid UI

For testing the function, we'll use the Candid UI, which is a web-based interface for interacting with canisters. It's automatically generated when you deploy a canister using the DFINITY Canister SDK.

Add this function to your `lib.rs` file:

```rust
#[ic_cdk::update]
async fn get_receipt(hash: String) -> String {
    let receipt = eth_get_transaction_receipt(hash).await.unwrap();

    serde_json::to_string(&receipt).unwrap()
}
```

1. **Deploy the Canister**: Deploy the updated canister using the command `yarn deploy hello`.

2. **Navigate to Candid UI**: After successful deployment, navigate to the Candid UI using the link provided in the terminal.
   Somthing like this `http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai`

3. **Test the Function**: Inside the Candid UI, you should see the `get_receipt` function. Test it by passing a transaction hash and observing the response.
   ![Alt text](assets/receipt.png)

## Step 9: On-Chain Verification of Transactions

In this step, we'll create a function to verify Ethereum transactions on-chain. This function will use the logs emitted by the smart contract to verify the transaction details.

#### Event Topics

The logs' topics are based on the `ReceivedEth` event, which has the following signature:
![Alt text](assets/logs.png)

```solidity
ReceivedEth (index_topic_1 address from, uint256 value, index_topic_2 bytes32 principal)
```

- `log.topics[0]`: Event signature hash
- `log.topics[1]`: `from` address (index_topic_1)
- `log.topics[2]`: `principal` (index_topic_2)

#### Event Data

- `log.data`: `value` (uint256)

### Create the `verify_transaction` Function

Here's the code snippet for the function:

```rust
const MINTER_ADDRESS: &str = "0xb44b5e756a894775fc32eddf3314bb1b1944dc34";
const MINIMUM_AMOUNT: u128 = 10000000000000000;

use b3_utils::hex_string_with_0x_to_nat;
use candid::Nat;
#[ic_cdk::update]
async fn verify_transaction(hash: String) -> (Nat, String) {
    let tx = eth_get_transaction_receipt(hash).await.unwrap();

    if tx.result.status != "0x1" {
        panic!("Transaction failed")
    }

    let log = tx.result.logs[0].clone();

    if tx.result.to != MINTER_ADDRESS && log.address != MINTER_ADDRESS {
        panic!("Address mismatch")
    }

    if log.topics[2] != canister_deposit_principal() {
        panic!("Principal mismatch")
    }

    let amount = hex_string_with_0x_to_nat(log.data).unwrap();

    if amount < MINIMUM_AMOUNT {
        panic!("Amount too low")
    }

    (amount, tx.result.from)
}
```

#### Understanding the Function

The function `verify_transaction` performs the following tasks:

- **Check Transaction Status**: It checks if the transaction was successful by comparing the `status` field to "0x1".

- **Verify Address**: It verifies that the `to` address in the transaction and the `address` in the logs match the minter address.

- **Verify Principal**: It verifies that the principal in the logs matches the canister's deposit principal. The principal is found in `log.topics[2]`.

- **Verify Amount**: It verifies that the amount in the logs is above the minimum required amount.

### Create a Function to Return Canister Deposit Principal

For a more robust and secure way, create a new function that returns the canister's deposit principal:

```rust
#[ic_cdk::query]
fn canister_deposit_principal() -> String {
    let subaccount = Subaccount::from(ic_cdk::id());

    let bytes32 = subaccount.to_bytes32().unwrap();

    vec_to_hex_string_with_0x(bytes32)
}
```

#### Testing the Functions

1. **Deploy the Canister**: Deploy the updated canister using `yarn deploy hello`.

2. **Navigate to Candid UI**: After successful deployment, navigate to the Candid UI using the link provided in the terminal.

3. **Test the Functions**: Inside the Candid UI, you should see the `verify_transaction` and `canister_deposit_principal` functions. Test them by passing a transaction hash and observing the response.
   ![Alt text](assets/candid_verify.png)

## Step 10: Frontend Update for On-Chain Verification

In this step, we'll update the frontend to call the `verify_transaction` function after the transaction has been confirmed on-chain.

### Create the `VerifyTransaction` Component

#### Understanding the Component

The `VerifyTransaction` component performs the following tasks:

- **Call `verify_transaction`**: It calls the `verify_transaction` function from the canister when the `hash` prop is provided.

- **Display Status**: It displays the transaction details, including the amount and the sender's address, once the transaction is confirmed on-chain.

Here's the code snippet for the component:

```javascript
import { useEffect } from "react"
import { useActorMethod } from "service/hello"
import { formatEther } from "viem"

interface VerifyTransactionProps {
  hash: string;
}

const VerifyTransaction: React.FC<VerifyTransactionProps> = ({ hash }) => {
  const { loading, error, data, call } = useActorMethod("verify_transaction")

  useEffect(() => {
    call(hash)
  }, [hash])

  if (loading) {
    return <div>Processing…</div>
  } else if (error) {
    return <div>{error.toString()}</div>
  } else if (data) {
    return (
      <div>
        Transaction(<b>{hash}</b>) with <b>{formatEther(data[0])}</b>ETH from{" "}
        <b>{data[1]}</b> is confirmed on-chain.
      </div>
    )
  } else {
    return null
  }
}

export default VerifyTransaction
```

### Update the `Confirmation` Component

Replace the line that shows the transaction status with the `VerifyTransaction` component:

Change this:

```javascript
return <div>Transaction Status: {data.status}</div>
```

To this:

```javascript
return <VerifyTransaction hash={data.transactionHash} />
```

#### Testing the Changes

1. **Run the App**: If not already running, start your app.

2. **Initiate a Transaction**: Initiate a deposit transaction and confirm it.

3. **Check the Output**: You should see the transaction details displayed once the transaction is confirmed on-chain.
