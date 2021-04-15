import React from "react";
import * as fcl from "@onflow/fcl";
import { admin } from "./auth-admin";

const AUTHORIZATION_FUNCTION = admin;

const mint = async () => {
  try {
    console.log("SENDING TRANSACTION");
    var response = await fcl.send([
      fcl.transaction`
      import Pixori from 0x05f5f6e2056f588b 

      transaction {
      
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
              let metadata: {String : String} = {
                "name" : "test1",
                "time": "00:57 AM"
               }
      
              }
              self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
              log("NFT Minted and deposited to the Current user's Collection")
          }
      }
    `,
      fcl.proposer(AUTHORIZATION_FUNCTION),
      fcl.authorizations([AUTHORIZATION_FUNCTION]),
      fcl.payer(AUTHORIZATION_FUNCTION),
      // fcl.args(metadata),
    ]);
    console.log("TRANSACTION SENT");
    console.log("TRANSACTION RESPONSE", response);

    console.log("WAITING FOR TRANSACTION TO BE SEALED");
    var data = await fcl.tx(response).onceSealed();
    console.log("TRANSACTION SEALED", data);

    if (data.status === 4 && data.statusCode === 0) {
      alert("Congrats!!! I Think It Works");
    } else {
      alert(`Oh No: ${data.errorMessage}`);
    }
  } catch (error) {
    console.error("FAILED TRANSACTION", error);
  }
};

export function MintCluster() {
  return (
    <div>
      <button onClick={mint}>Mint</button>
    </div>
  );
}

