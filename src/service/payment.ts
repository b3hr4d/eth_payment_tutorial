import { createReactor } from "@ic-reactor/react"
import { canisterId, idlFactory, payment } from "declarations/payment"

export const { useActorState, useUpdateCall, useQueryCall } = createReactor<
  typeof payment
>({
  canisterId,
  idlFactory,
  host: process.env.NEXT_PUBLIC_IC_HOST
})
