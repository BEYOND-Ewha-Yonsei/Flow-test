// File: ./src/App.js

import React from "react"
import {AuthCluster} from "./auth-cluster"
import {InitCluster} from "./init-cluster"
import {ProfileCluster} from "./profile-cluster"
import {useCurrentUser} from "./hooks/current-user"
import {SetupCluster} from "./setup-cluster"
import {TokenCluster} from "./tokendata-cluster"
import {Link, BrowserRouter} from 'react-router-dom'
import {MintCluster} from "./mint-cluster"


export default function App() {
  const cu = useCurrentUser()

  return (
    <div>
      <AuthCluster />
      <InitCluster address={cu.addr} />
      <SetupCluster address={cu.addr} />
      <TokenCluster address={cu.addr} />
      <MintCluster />
      
      <ProfileCluster address={cu.addr} />
      <ProfileCluster address="0xba1132bc08f82fe2" />
    </div>
  )
}