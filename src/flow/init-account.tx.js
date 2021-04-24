// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"

export async function initAccount() {
  const txId = await fcl
    .send([
      fcl.transaction`
        import Profile from 0xProfile

        transaction {
          let address: Address

          prepare(account: AuthAccount) {
            self.address = account.address

            if (!Profile.check(self.address)) {
              account.save(<- Profile.new(), to: Profile.privatePath)
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }

          post {
            Profile.check(self.address): "Account was not initialized"
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