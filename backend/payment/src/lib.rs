use b3_utils::api::{CallCycles, InterCall};
use b3_utils::{caller_is_controller, hex_string_with_0x_to_nat};
use b3_utils::{vec_to_hex_string_with_0x, Subaccount};
use candid::Nat;

const MINTER_ADDRESS: &str = "0xb44b5e756a894775fc32eddf3314bb1b1944dc34";
const LEDGER: &str = "apia6-jaaaa-aaaar-qabma-cai";
const MINTER: &str = "jzenf-aiaaa-aaaar-qaa7q-cai";

use b3_utils::memory::init_stable_mem_refcell;
use b3_utils::memory::types::DefaultStableBTreeMap;
use std::cell::RefCell;

use evm_rpc_canister_types::{
    EthSepoliaService, EvmRpcCanister, GetTransactionReceiptResult,
    MultiGetTransactionReceiptResult, RpcServices,
};

thread_local! {
    static TRANSACTIONS: RefCell<DefaultStableBTreeMap<String, String>> = init_stable_mem_refcell("trasnactions", 1).unwrap();
    static ITEMS: RefCell<DefaultStableBTreeMap<String, u128>> = init_stable_mem_refcell("items", 2).unwrap();
}

pub const EVM_RPC_CANISTER_ID: Principal =
    Principal::from_slice(b"\x00\x00\x00\x00\x02\x30\x00\xCC\x01\x01"); // 7hfb6-caaaa-aaaar-qadga-cai
pub const EVM_RPC: EvmRpcCanister = EvmRpcCanister(EVM_RPC_CANISTER_ID);

#[ic_cdk::query]
fn get_transaction_list() -> Vec<(String, String)> {
    TRANSACTIONS.with(|t| {
        t.borrow()
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect()
    })
}

#[ic_cdk::update(guard = "caller_is_controller")]
fn set_item(item: String, price: u128) {
    ITEMS.with(|p| p.borrow_mut().insert(item, price));
}

#[ic_cdk::query]
fn get_items() -> Vec<(String, u128)> {
    ITEMS.with(|p| {
        p.borrow()
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect()
    })
}

#[derive(CandidType, Deserialize)]
pub struct VerifiedTransactionDetails {
    pub amount: Nat,
    pub from: String,
}

#[ic_cdk::update]
async fn buy_item(item: String, hash: String) -> u64 {
    if TRANSACTIONS.with(|t| t.borrow().contains_key(&hash)) {
        panic!("Transaction already processed");
    }

    let price = ITEMS.with(|p| {
        p.borrow()
            .get(&item)
            .unwrap_or_else(|| panic!("Item not found"))
            .clone()
    });

    let verified_details = verify_transaction(hash.clone()).await;

    let VerifiedTransactionDetails { amount, from } = verified_details;

    if amount < price {
        panic!("Amount too low");
    }

    TRANSACTIONS.with(|t| {
        let mut t = t.borrow_mut();
        t.insert(hash, from);

        t.len() as u64
    })
}

// Testing get receipt function
#[ic_cdk::update]
async fn get_receipt(hash: String) -> GetTransactionReceiptResult {
    eth_get_transaction_receipt(hash).await.unwrap()
}

async fn eth_get_transaction_receipt(hash: String) -> Result<GetTransactionReceiptResult, String> {
    // Make the call to the EVM_RPC canister
    let result: Result<(MultiGetTransactionReceiptResult,), String> = EVM_RPC
        .eth_get_transaction_receipt(
            RpcServices::EthSepolia(Some(vec![
                EthSepoliaService::PublicNode,
                EthSepoliaService::BlockPi,
                EthSepoliaService::Ankr,
            ])),
            None,
            hash,
            10_000_000_000,
        )
        .await
        .map_err(|e| format!("Failed to call eth_getTransactionReceipt: {:?}", e));

    match result {
        Ok((MultiGetTransactionReceiptResult::Consistent(receipt),)) => Ok(receipt),
        Ok((MultiGetTransactionReceiptResult::Inconsistent(error),)) => Err(format!(
            "EVM_RPC returned inconsistent results: {:?}",
            error
        )),
        Err(e) => Err(format!("Error calling EVM_RPC: {}", e)),
    }
}

// Function for verifying the transaction on-chain
#[ic_cdk::update]
async fn verify_transaction(hash: String) -> VerifiedTransactionDetails {
    // Get the transaction receipt
    let receipt_result = match eth_get_transaction_receipt(hash).await {
        Ok(receipt) => receipt,
        Err(e) => panic!("Failed to get receipt: {}", e),
    };

    // Ensure the transaction was successful
    let receipt = match receipt_result {
        GetTransactionReceiptResult::Ok(Some(receipt)) => receipt,
        GetTransactionReceiptResult::Ok(None) => panic!("Receipt is None"),
        GetTransactionReceiptResult::Err(e) => {
            panic!("Error on Get transaction receipt result: {:?}", e)
        }
    };

    // Check if the status indicates success (Nat 1)
    let success_status = Nat::from(1u8);
    if receipt.status != success_status {
        panic!("Transaction failed");
    }

    // Verify the 'to' address matches the minter address
    if receipt.to != MINTER_ADDRESS {
        panic!("Minter address does not match");
    }

    let deposit_principal = canister_deposit_principal();

    // Verify the principal in the logs matches the deposit principal
    let log_principal = receipt
        .logs
        .iter()
        .find(|log| log.topics.get(2).map(|topic| topic.as_str()) == Some(&deposit_principal))
        .unwrap_or_else(|| panic!("Principal not found in logs"));

    // Extract relevant transaction details
    let amount = hex_string_with_0x_to_nat(&log_principal.data).unwrap();
    let from_address = receipt.from.clone();

    VerifiedTransactionDetails {
        amount,
        from: from_address,
    }
}

#[ic_cdk::query]
fn canister_deposit_principal() -> String {
    let subaccount = Subaccount::from(ic_cdk::id());

    let bytes32 = subaccount.to_bytes32().unwrap();

    vec_to_hex_string_with_0x(bytes32)
}
// Balance -----------------------------
use b3_utils::ledger::{ICRCAccount, ICRC1};
use candid::Principal;

#[ic_cdk::update]
async fn balance() -> Nat {
    let account = ICRCAccount::new(ic_cdk::id(), None);

    ICRC1::from(LEDGER).balance_of(account).await.unwrap()
}

// Transfer -----------------------------
use b3_utils::ledger::{ICRC1TransferArgs, ICRC1TransferResult};
use std::str::FromStr;

#[ic_cdk::update(guard = "caller_is_controller")]
async fn transfer(to: String, amount: Nat) -> ICRC1TransferResult {
    let to = ICRCAccount::from_str(&to).unwrap();

    let transfer_args = ICRC1TransferArgs {
        to,
        amount,
        from_subaccount: None,
        fee: None,
        memo: None,
        created_at_time: None,
    };

    ICRC1::from(LEDGER).transfer(transfer_args).await.unwrap()
}

// Approve -----------------------------
use b3_utils::ledger::{ICRC2ApproveArgs, ICRC2ApproveResult, ICRC2};

#[ic_cdk::update(guard = "caller_is_controller")]
async fn approve(amount: Nat) -> ICRC2ApproveResult {
    let minter = Principal::from_text(&MINTER).unwrap();

    let spender = ICRCAccount::from(minter);

    let args = ICRC2ApproveArgs {
        amount,
        spender,
        created_at_time: None,
        expected_allowance: None,
        expires_at: None,
        fee: None,
        memo: None,
        from_subaccount: None,
    };

    ICRC2::from(LEDGER).approve(args).await.unwrap()
}
// Withdrawal -----------------------------
use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize)]
pub struct WithdrawalArg {
    pub amount: Nat,
    pub recipient: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct RetrieveEthRequest {
    pub block_index: Nat,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum WithdrawalError {
    AmountTooLow { min_withdrawal_amount: Nat },
    InsufficientFunds { balance: Nat },
    InsufficientAllowance { allowance: Nat },
    TemporarilyUnavailable(String),
}

type WithdrawalResult = Result<RetrieveEthRequest, WithdrawalError>;

#[ic_cdk::update(guard = "caller_is_controller")]
async fn withdraw(amount: Nat, recipient: String) -> WithdrawalResult {
    let withraw = WithdrawalArg { amount, recipient };

    InterCall::from(MINTER)
        .call("withdraw_eth", withraw, CallCycles::NoPay)
        .await
        .unwrap()
}

// Export -----------------------------
ic_cdk::export_candid!();
