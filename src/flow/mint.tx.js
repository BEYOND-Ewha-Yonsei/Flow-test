// File: ./src/flow/mint.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function isSetup(address) {
  if (address == null)
    throw new Error("isSetup(address) -- address required")

  return fcl
    .send([
      fcl.script`
      import Pixori from 0x05f5f6e2056f588b 

      transaction(metadata: {String: String}) {
      
          let receiverRef: &{Pixori.NFTReceiver}
          let minterRef: &Pixori.NFTMinter
      
          prepare(acct: AuthAccount) {
      
              self.receiverRef = acct.getCapability<&{Pixori.NFTReceiver}>(/public/NFTReceiver)
                  .borrow()
                  ?? panic("Could not borrow receiver reference")
              
              self.minterRef = acct.borrow<&Pixori.NFTMinter>(from: /storage/NFTMinter)
                  ?? panic("Could not borrow minter reference")
          }
      
          execute {
      
              let newNFT <- self.minterRef.mintNFT()
      
              }
              self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
              log("NFT Minted and deposited to the Current user's Collection")
          }
      }
      `,
      fcl.payer(admin), 
      fcl.proposer(admin), 
      fcl.authorizations(admin), 
      fcl.limit(35),
      fcl.args(metadata),
    ])
    .then(fcl.decode)
}