import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

export function TokenCluster({address}) {
  const [nftInfo, setNftInfo] = useState(null)
  const fetchTokenData = async () => {
    const encoded = await fcl
      .send([
        fcl.script`
        import Pixori from 0x05f5f6e2056f588b

        pub fun main(address: Address): [{String: String}] {
          let nftOwner = getAccount(address)  
          let capability = nftOwner.getCapability<&{Pixori.NFTReceiver}>(/public/NFTReceiver)
      
          let receiverRef = capability.borrow()
              ?? panic("Could not borrow the receiver reference")

          let allIDs = receiverRef.getIDs()
          var allMetadata: [{String: String}] = []
      
          for id in allIDs {
              allMetadata.append(receiverRef.getMetadata(id: id))
          }

          return allMetadata
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
      ])
    
    const decoded = await fcl.decode(encoded)
    setNftInfo(decoded) // Error: Objects are not valid as a React child (found: object with keys {name, time, location}). 
    // If you meant to render a collection of children, use an array instead.
  };
  return (
    <div>
      <div>
        <button onClick={fetchTokenData}>Fetch Token Data</button>        
      </div>
      {
        nftInfo &&
        <div>
          {
            nftInfo.map(k => {
              return(
                <div>{JSON.stringify(nftInfo)}</div>)
            })
          }
          <button onClick={() => setNftInfo(null)}>Clear Token Info</button>
        </div>
      }
    </div>
  );
}