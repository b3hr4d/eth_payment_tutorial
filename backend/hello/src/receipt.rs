use serde_derive::Deserialize;
use serde_derive::Serialize;
use serde_json::Value;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Root {
    pub jsonrpc: String,
    pub id: i64,
    pub result: Result,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Result {
    pub transaction_hash: String,
    pub block_hash: String,
    pub block_number: String,
    pub logs: Vec<Log>,
    pub contract_address: Value,
    pub effective_gas_price: String,
    pub cumulative_gas_used: String,
    pub from: String,
    pub gas_used: String,
    pub logs_bloom: String,
    pub status: String,
    pub to: String,
    pub transaction_index: String,
    #[serde(rename = "type")]
    pub type_field: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Log {
    pub transaction_hash: String,
    pub address: String,
    pub block_hash: String,
    pub block_number: String,
    pub data: String,
    pub log_index: String,
    pub removed: bool,
    pub topics: Vec<String>,
    pub transaction_index: String,
}
