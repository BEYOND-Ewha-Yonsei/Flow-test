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

        pub fun main(address: Address) : {String : String} {
          let nftOwner = getAccount(address)  
          let capability = nftOwner.getCapability<&{Pixori.NFTReceiver}>(/public/NFTReceiver)
      
          let receiverRef = capability.borrow()
              ?? panic("Could not borrow the receiver reference")
      
          return receiverRef.getMetadata(id: 2)
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
      ])
    
    const decoded = await fcl.decode(encoded)
    setNftInfo(decoded)
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
            Object.keys(nftInfo).map(k => {
              return (
                <p>{k}: {nftInfo[k]}</p>
              )
            })
          }
          <button onClick={() => setNftInfo(null)}>Clear Token Info</button>
        </div>
      }
    </div>
  );
}