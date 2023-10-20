import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'canister_deposit_principal' : ActorMethod<[], string>,
  'verify_transaction' : ActorMethod<[string], [bigint, string]>,
}
