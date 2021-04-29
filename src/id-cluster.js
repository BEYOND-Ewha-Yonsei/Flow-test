import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

export function IDCluster({address}) {
  const [idInfo, setIdInfo] = useState(null)
  const fetchID = async () => {
    const encoded = await fcl
      .send([
        fcl.script`
        import Pixori from 0x05f5f6e2056f588b

        pub fun main(address: Address): [UInt64] {
        
          let nftOwner = getAccount(address)
          let capability = nftOwner.getCapability<&{Pixori.NFTReceiver}>(/public/NFTReceiver)
          let receiverRef = capability.borrow()
              ?? panic("Could not borrow receiver reference")
                
          let ids = receiverRef.getIDs()
          return ids
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
      ])
    
    const decoded = await fcl.decode(encoded)
    setIdInfo(decoded) 
  };

  return (
    <div>
      <div>
        <button onClick={fetchID}>Show IDs</button>        
      </div>
      {
        idInfo &&
        <div>
          <p>{idInfo}</p>
          <button onClick={() => setIdInfo(null)}>Clear IDs</button>
        </div>
      }
    </div>
  );
}