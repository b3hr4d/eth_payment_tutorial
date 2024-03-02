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
  const RetrieveEthRequest = IDL.Record({ 'block_index' : IDL.Nat });
  const WithdrawalError = IDL.Variant({
    'TemporarilyUnavailable' : IDL.Text,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'AmountTooLow' : IDL.Record({ 'min_withdrawal_amount' : IDL.Nat }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result_2 = IDL.Variant({
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
    'get_transaction_list' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'set_item' : IDL.Func([IDL.Text, IDL.Nat], [], []),
    'transfer' : IDL.Func([IDL.Text, IDL.Nat], [Result_1], []),
    'verify_transaction' : IDL.Func([IDL.Text], [IDL.Nat, IDL.Text], []),
    'withdraw' : IDL.Func([IDL.Nat, IDL.Text], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Text)]; };
