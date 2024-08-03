import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type GetTransactionReceiptResult = { 'Ok' : [] | [TransactionReceipt] } |
  { 'Err' : RpcError };
export type HttpOutcallError = {
    'IcError' : { 'code' : RejectionCode, 'message' : string }
  } |
  {
    'InvalidHttpJsonRpcResponse' : {
      'status' : number,
      'body' : string,
      'parsingError' : [] | [string],
    }
  };
export type ICRC1TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type ICRC2ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'AllowanceChanged' : { 'current_allowance' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'Expired' : { 'ledger_time' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface JsonRpcError { 'code' : bigint, 'message' : string }
export interface LogEntry {
  'transactionHash' : [] | [string],
  'blockNumber' : [] | [bigint],
  'data' : string,
  'blockHash' : [] | [string],
  'transactionIndex' : [] | [bigint],
  'topics' : Array<string>,
  'address' : string,
  'logIndex' : [] | [bigint],
  'removed' : boolean,
}
export type ProviderError = {
    'TooFewCycles' : { 'expected' : bigint, 'received' : bigint }
  } |
  { 'MissingRequiredProvider' : null } |
  { 'ProviderNotFound' : null } |
  { 'NoPermission' : null };
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export type Result = { 'Ok' : bigint } |
  { 'Err' : ICRC2ApproveError };
export type Result_1 = { 'Ok' : bigint } |
  { 'Err' : ICRC1TransferError };
export type Result_2 = { 'Ok' : RetrieveEthRequest } |
  { 'Err' : WithdrawalError };
export interface RetrieveEthRequest { 'block_index' : bigint }
export type RpcError = { 'JsonRpcError' : JsonRpcError } |
  { 'ProviderError' : ProviderError } |
  { 'ValidationError' : ValidationError } |
  { 'HttpOutcallError' : HttpOutcallError };
export interface TransactionReceipt {
  'to' : string,
  'status' : bigint,
  'transactionHash' : string,
  'blockNumber' : bigint,
  'from' : string,
  'logs' : Array<LogEntry>,
  'blockHash' : string,
  'type' : string,
  'transactionIndex' : bigint,
  'effectiveGasPrice' : bigint,
  'logsBloom' : string,
  'contractAddress' : [] | [string],
  'gasUsed' : bigint,
}
export type ValidationError = { 'CredentialPathNotAllowed' : null } |
  { 'HostNotAllowed' : string } |
  { 'CredentialHeaderNotAllowed' : null } |
  { 'UrlParseError' : string } |
  { 'Custom' : string } |
  { 'InvalidHex' : string };
export interface VerifiedTransactionDetails {
  'from' : string,
  'amount' : bigint,
}
export type WithdrawalError = { 'TemporarilyUnavailable' : string } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'AmountTooLow' : { 'min_withdrawal_amount' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface _SERVICE {
  'approve' : ActorMethod<[bigint], Result>,
  'balance' : ActorMethod<[], bigint>,
  'buy_item' : ActorMethod<[string, string], bigint>,
  'canister_deposit_principal' : ActorMethod<[], string>,
  'get_items' : ActorMethod<[], Array<[string, bigint]>>,
  'get_receipt' : ActorMethod<[string], GetTransactionReceiptResult>,
  'get_transaction_list' : ActorMethod<[], Array<[string, string]>>,
  'set_item' : ActorMethod<[string, bigint], undefined>,
  'transfer' : ActorMethod<[string, bigint], Result_1>,
  'verify_transaction' : ActorMethod<[string], VerifiedTransactionDetails>,
  'withdraw' : ActorMethod<[bigint, string], Result_2>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
