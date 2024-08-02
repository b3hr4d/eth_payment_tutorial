import { createReactor } from "@ic-reactor/react"
import { canisterId, idlFactory, payment } from "declarations/payment"

export const { useActorState, useUpdateCall, useQueryCall } = createReactor<
  typeof payment
>({
  canisterId,
  idlFactory,
  withProcessEnv: true
})
