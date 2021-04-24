// File: ./src/flow/setup-account.tx.js

import * as fcl from "@onflow/fcl"

export async function setupAccount() {
  const txId = await fcl
    .send([
      fcl.transaction`
        import Pixori from 0x05f5f6e2056f588b

        transaction {
          prepare(account: AuthAccount) {  
            let collection <- Pixori.createEmptyCollection()
  
            account.save<@Pixori.Collection>(<-collection, to: /storage/NFTCollection)
            account.link<&{Pixori.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)
          }
      }
      `,
      fcl.payer(fcl.authz), 
      fcl.proposer(fcl.authz), 
      fcl.authorizations([fcl.authz]), 
      fcl.limit(35), 
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}