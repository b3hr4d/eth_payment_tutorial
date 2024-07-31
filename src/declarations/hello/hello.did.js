export const idlFactory = ({ IDL }) => {
  const ICRC2ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'Expired' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ICRC2ApproveError });
  const LogEntry = IDL.Record({
    'transactionHash' : IDL.Opt(IDL.Text),
    'blockNumber' : IDL.Opt(IDL.Nat),
    'data' : IDL.Text,
    'blockHash' : IDL.Opt(IDL.Text),
    'transactionIndex' : IDL.Opt(IDL.Nat),
    'topics' : IDL.Vec(IDL.Text),
    'address' : IDL.Text,
    'logIndex' : IDL.Opt(IDL.Nat),
    'removed' : IDL.Bool,
  });
  const TransactionReceipt = IDL.Record({
    'to' : IDL.Text,
    'status' : IDL.Nat,
    'transactionHash' : IDL.Text,
    'blockNumber' : IDL.Nat,
    'from' : IDL.Text,
    'logs' : IDL.Vec(LogEntry),
    'blockHash' : IDL.Text,
    'type' : IDL.Text,
    'transactionIndex' : IDL.Nat,
    'effectiveGasPrice' : IDL.Nat,
    'logsBloom' : IDL.Text,
    'contractAddress' : IDL.Opt(IDL.Text),
    'gasUsed' : IDL.Nat,
  });
  const JsonRpcError = IDL.Record({ 'code' : IDL.Int64, 'message' : IDL.Text });
  const ProviderError = IDL.Variant({
    'TooFewCycles' : IDL.Record({ 'expected' : IDL.Nat, 'received' : IDL.Nat }),
    'MissingRequiredProvider' : IDL.Null,
    'ProviderNotFound' : IDL.Null,
    'NoPermission' : IDL.Null,
  });
  const ValidationError = IDL.Variant({
    'CredentialPathNotAllowed' : IDL.Null,
    'HostNotAllowed' : IDL.Text,
    'CredentialHeaderNotAllowed' : IDL.Null,
    'UrlParseError' : IDL.Text,
    'Custom' : IDL.Text,
    'InvalidHex' : IDL.Text,
  });
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const HttpOutcallError = IDL.Variant({
    'IcError' : IDL.Record({ 'code' : RejectionCode, 'message' : IDL.Text }),
    'InvalidHttpJsonRpcResponse' : IDL.Record({
      'status' : IDL.Nat16,
      'body' : IDL.Text,
      'parsingError' : IDL.Opt(IDL.Text),
    }),
  });
  const RpcError = IDL.Variant({
    'JsonRpcError' : JsonRpcError,
    'ProviderError' : ProviderError,
    'ValidationError' : ValidationError,
    'HttpOutcallError' : HttpOutcallError,
  });
  const GetTransactionReceiptResult = IDL.Variant({
    'Ok' : IDL.Opt(TransactionReceipt),
    'Err' : RpcError,
  });
  const ICRC1TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ICRC1TransferError });
  const VerifiedTransactionDetails = IDL.Record({
    'from' : IDL.Text,
    'amount' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'Ok' : VerifiedTransactionDetails,
    'Err' : IDL.Text,
  });
  const RetrieveEthRequest = IDL.Record({ 'block_index' : IDL.Nat });
  const WithdrawalError = IDL.Variant({
    'TemporarilyUnavailable' : IDL.Text,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'AmountTooLow' : IDL.Record({ 'min_withdrawal_amount' : IDL.Nat }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result_3 = IDL.Variant({
    'Ok' : RetrieveEthRequest,
    'Err' : WithdrawalError,
  });
  return IDL.Service({
    'approve' : IDL.Func([IDL.Nat], [Result], []),
    'balance' : IDL.Func([], [IDL.Nat], []),
    'buy_item' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat64], []),
    'canister_deposit_principal' : IDL.Func([], [IDL.Text], ['query']),
    'get_items' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'get_receipt' : IDL.Func([IDL.Text], [GetTransactionReceiptResult], []),
    'get_transaction_list' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'set_item' : IDL.Func([IDL.Text, IDL.Nat], [], []),
    'transfer' : IDL.Func([IDL.Text, IDL.Nat], [Result_1], []),
    'verify_transaction' : IDL.Func([IDL.Text], [Result_2], []),
    'withdraw' : IDL.Func([IDL.Nat, IDL.Text], [Result_3], []),
  });
};
export const init = ({ IDL }) => { return []; };
