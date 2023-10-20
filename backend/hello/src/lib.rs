use b3_utils::outcall::{HttpOutcall, HttpOutcallResponse};
use b3_utils::{hex_string_with_0x_to_nat, vec_to_hex_string_with_0x, Subaccount};
use candid::Nat;
use serde_json::json;
mod receipt;

const RPC_URL: &str = "https://eth-sepolia.g.alchemy.com/v2/ZpSPh3E7KZQg4mb3tN8WFXxG4Auntbxp";
const MINTER_ADDRESS: &str = "0xb44b5e756a894775fc32eddf3314bb1b1944dc34";
const MINIMUM_AMOUNT: u128 = 10_000_000_000_000_000;

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

#[ic_cdk::query]
fn canister_deposit_principal() -> String {
    let subaccount = Subaccount::from(ic_cdk::id());

    let bytes32 = subaccount.to_bytes32().unwrap();

    vec_to_hex_string_with_0x(bytes32)
}

ic_cdk::export_candid!();
