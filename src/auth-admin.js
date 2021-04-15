import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import * as fcl from "@onflow/fcl";
const ec = new EC("p256");

const ADDRESS = "05f5f6e2056f588b";
const PRIVATE_KEY =
  "cfa7ed37cd930acd4f64c843901f276bc66941952b75a7c0e1646a50ec486e22";

const hashMsgHex = msgHex => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, "hex"));
  return sha.digest();
};

export const signWithKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32; // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

export const admin = async (account = {}) => {
  const addr = ADDRESS;
  const keyId = 0;

  let sequenceNum;
  if (account.role.proposer) {
    const response = await fcl.send([fcl.getAccount(addr)]);
    const acct = await fcl.decode(response);
    sequenceNum = acct.keys[keyId].sequenceNumber;
  }

  const signingFunction = data => {
    return {
      addr,
      keyId,
      signature: signWithKey(PRIVATE_KEY, data.message)
    };
  };

  return {
    ...account,
    addr,
    keyId,
    signingFunction,
    sequenceNum
  };
};
