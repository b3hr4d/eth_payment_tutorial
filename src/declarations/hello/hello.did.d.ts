import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

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
export type Result = { 'Ok' : bigint } |
  { 'Err' : ICRC2ApproveError };
export type Result_1 = { 'Ok' : bigint } |
  { 'Err' : ICRC1TransferError };
export type Result_2 = { 'Ok' : VerifiedTransactionDetails } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : RetrieveEthRequest } |
  { 'Err' : WithdrawalError };
export interface RetrieveEthRequest { 'block_index' : bigint }
export interface VerifiedTransactionDetails {
  'from' : string,
  'amount' : string,
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
  'get_receipt' : ActorMethod<[string], string>,
  'get_transaction_list' : ActorMethod<[], Array<[string, string]>>,
  'set_item' : ActorMethod<[string, bigint], undefined>,
  'transfer' : ActorMethod<[string, bigint], Result_1>,
  'verify_transaction' : ActorMethod<[string], Result_2>,
  'withdraw' : ActorMethod<[bigint, string], Result_3>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
