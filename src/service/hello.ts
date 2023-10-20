import createReActor from "@re-actor/core"
import { canisterId, createActor } from "declarations/hello"

export const {
  ReActorProvider,
  callActor,
  initialize,
  useReActor,
  useActorState,
  useActorMethod
} = createReActor(() =>
  createActor(canisterId, {
    agentOptions: {
      host: process.env.NEXT_PUBLIC_IC_HOST
    }
  })
)
