use b3_utils::caller_is_controller;
use b3_utils::{hex_string_with_0x_to_nat, vec_to_hex_string_with_0x, Subaccount};
use b3_utils::{HttpOutcall, HttpOutcallResponse};
use candid::Nat;
use serde_json::json;
mod receipt;

const MINTER_ADDRESS: &str = "0xb44b5e756a894775fc32eddf3314bb1b1944dc34";
const LEDGER: &str = "apia6-jaaaa-aaaar-qabma-cai";
const MINTER: &str = "jzenf-aiaaa-aaaar-qaa7q-cai";

use b3_utils::memory::init_stable_mem_refcell;
use b3_utils::memory::types::{DefaultStableBTreeMap, DefaultStableCell};
use std::cell::RefCell;

thread_local! {
    static TRANSACTIONS: RefCell<DefaultStableBTreeMap<String, String>> = init_stable_mem_refcell("trasnactions", 1).unwrap();
    static ITEMS: RefCell<DefaultStableBTreeMap<String, u128>> = init_stable_mem_refcell("items", 2).unwrap();
    static RPC_URL: RefCell<DefaultStableCell<String>> = init_stable_mem_refcell("rpc_url", 3).unwrap();
}

fn rpc_url() -> String {
    RPC_URL.with(|r| r.borrow().get().clone())
}

#[ic_cdk::init]
fn init(rpc_url: Option<String>) {
    if let Some(rpc_url) = rpc_url {
        RPC_URL.with(|r| r.borrow_mut().set(rpc_url)).unwrap();
    }
}

#[ic_cdk::post_upgrade]
fn post_upgrade(rpc_url: Option<String>) {
    if let Some(rpc_url) = rpc_url {
        RPC_URL.with(|r| r.borrow_mut().set(rpc_url)).unwrap();
    }
}

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

#[ic_cdk::update]
async fn buy_item(item: String, hash: String) -> u64 {
    if TRANSACTIONS.with(|t| t.borrow().contains_key(&hash)) {
        panic!("Transaction already processed")
    }

    let price = ITEMS.with(|p| {
        p.borrow()
            .get(&item)
            .map(|p| p.clone())
            .unwrap_or_else(|| panic!("Item not found"))
    });

    let (amount, from) = verify_transaction(hash.clone()).await;

    if amount < price {
        panic!("Amount too low")
    }

    TRANSACTIONS.with(|t| {
        let mut t = t.borrow_mut();
        t.insert(hash, from);

        t.len() as u64
    })
}

async fn eth_get_transaction_receipt(hash: String) -> Result<receipt::Root, String> {
    let rpc = json!({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "eth_getTransactionReceipt",
        "params": [hash]
    });

    let request = HttpOutcall::new(&rpc_url())
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

#[ic_cdk::update]
async fn verify_transaction(hash: String) -> (Nat, String) {
    let tx = eth_get_transaction_receipt(hash).await.unwrap();

    if tx.result.status != "0x1" {
        panic!("Transaction failed")
    }

    let log = tx.result.logs[0].clone();

    if tx.result.to != MINTER_ADDRESS || log.address != MINTER_ADDRESS {
        panic!("Address mismatch")
    }

    if log.topics[2] != canister_deposit_principal() {
        panic!("Principal mismatch")
    }

    let amount = hex_string_with_0x_to_nat(log.data).unwrap();

    (amount, tx.result.from)
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

use b3_utils::InterCall;

#[ic_cdk::update(guard = "caller_is_controller")]
async fn withdraw(amount: Nat, recipient: String) -> WithdrawalResult {
    let withraw = WithdrawalArg { amount, recipient };

    InterCall::from(MINTER)
        .call("withdraw_eth", withraw)
        .await
        .unwrap()
}

// Export -----------------------------
ic_cdk::export_candid!();
