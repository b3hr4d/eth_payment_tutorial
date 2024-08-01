use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct LogEntry {
    pub address: String,
    pub topics: Vec<String>,
}

#[derive(Serialize)]
pub enum ReceiptWrapper {
    Ok(TransactionReceiptData),
    Err(String),
}

#[derive(Serialize)]
pub struct TransactionReceiptData {
    pub to: String,
    pub status: String, 
    pub transaction_hash: String,
    pub block_number: String, 
    pub from: String,
    pub logs: Vec<LogEntry>, 
}

#[derive(Serialize, CandidType, Deserialize)]
pub struct VerifiedTransactionDetails {
    pub amount: String,
    pub from: String,
}