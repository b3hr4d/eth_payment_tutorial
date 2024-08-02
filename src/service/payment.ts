import { createReactor } from "@ic-reactor/react"
import { canisterId, idlFactory, payment } from "declarations/payment"

export const { initialize, useActorState, useUpdateCall, useQueryCall } =
  createReactor<typeof payment>({
    canisterId,
    idlFactory,
    withProcessEnv: true
  })
