// File: ./src/hooks/setup.js

import {atomFamily, useRecoilState} from "recoil"
import {isSetup} from "../flow/is-setup.script"
import {setupAccount} from "../flow/setup-account.tx"

const IDLE = "IDLE"
const PROCESSING = "PROCESSING"

const $setup = atomFamily({
  key: "SETUP::PIXORI::STATE",
  default: null,
})

const $setupStatus = atomFamily({
  key: "SETUP::PIXORI::STATUS",
  default: PROCESSING,
})

export function useSetup(address) {
  const [set, setSetup] = useRecoilState($setup(address))
  const [status, setStatus] = useRecoilState($setupStatus(address))

  // check if the supplied address is setup
  async function check() {
    setStatus(PROCESSING)

    if (address != null) await isSetup(address).then(setSetup)
    setStatus(IDLE)
  }

  async function exec() {
    setStatus(PROCESSING)
    await setupAccount()
    setStatus(IDLE)
    await check()
  }

  return {
    set,
    check,
    exec,
    isIdle: status === IDLE,
    isProcessing: status === PROCESSING,
    status,
    IDLE,
    PROCESSING,
  }
}