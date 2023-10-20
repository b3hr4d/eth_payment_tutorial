export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'canister_deposit_principal' : IDL.Func([], [IDL.Text], ['query']),
    'verify_transaction' : IDL.Func([IDL.Text], [IDL.Nat, IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
