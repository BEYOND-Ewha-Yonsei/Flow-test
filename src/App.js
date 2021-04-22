// File: ./src/App.js

import React from "react"
import {AuthCluster} from "./auth-cluster"
import {InitCluster} from "./init-cluster"
import {ProfileCluster} from "./profile-cluster"
import {useCurrentUser} from "./hooks/current-user"
import {SetupCluster} from "./setup-cluster"
import {TokenCluster} from "./tokendata-cluster"
import {MintCluster} from "./mint-cluster"
import {TransferCluster} from "./transfer-cluster"
import {IDCluster} from "./id-cluster"

export default function App() {
  const cu = useCurrentUser()
  

  return (
    <div>
      <AuthCluster />
      <InitCluster address={cu.addr} />
      <SetupCluster address={cu.addr} />

      <p><strong>MY NFT</strong>
      <IDCluster address={cu.addr} />
      <TokenCluster address={cu.addr} />
      </p>

      <p><strong>ADMIN's NFT</strong>
      <MintCluster />
      <IDCluster address="0x05f5f6e2056f588b" />
      <TransferCluster address={cu.addr} />
      </p>
      
      <ProfileCluster address={cu.addr} />
      <ProfileCluster address="0xba1132bc08f82fe2" />
    </div>
  )
}