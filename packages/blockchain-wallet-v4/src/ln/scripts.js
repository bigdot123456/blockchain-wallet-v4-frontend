import * as SCRIPT from 'bitcoinjs-lib/src/script'
import * as hash from 'bcoin/lib/crypto/digest'

import * as OPS from 'bitcoin-ops'

import Long from 'long'

let OP_CSV = 178

let intTo48BigNum = (num) => {
  let l = new Long(num)

  let b = Buffer.alloc(8)
  b.writeInt32BE(l.hi, 0)
  b.writeInt32BE(l.low, 4)

  return b.slice(3)
}

let intToNum = (num) => {
  let b = null

  if (num < 65536) {
    b = Buffer.alloc(2)
    b.writeInt16LE(num)
  } else if (num < 4294967296) {
    b = Buffer.alloc(4)
    b.writeInt32LE(num)
  } else {
    throw new Error('Number too big: ' + num)
  }

  return b
}

export let getFundingOutputScript = (fundingKeyLocal, fundingKeyRemote) => {
  // 2 <key1> <key2> 2 OP_CHECKMULTISIG

  let chunks = []

  chunks.push(OPS.OP_2)

  if (Buffer.compare(fundingKeyLocal, fundingKeyRemote) < 0) {
    chunks.push(fundingKeyLocal)
    chunks.push(fundingKeyRemote)
  } else {
    chunks.push(fundingKeyRemote)
    chunks.push(fundingKeyLocal)
  }

  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_CHECKMULTISIG)

  return SCRIPT.compile(chunks)
}

export let getToLocalOutputScript = (revocationKey, toSelfDelay, localDelayedKey) => {
  // OP_IF
  //   # Penalty transaction
  //   <revocationkey>
  // OP_ELSE
  //   `to_self_delay`
  //   OP_CSV
  //   OP_DROP
  //   <local_delayedkey>
  // OP_ENDIF
  // OP_CHECKSIG

  let chunks = []

  chunks.push(OPS.OP_IF)
  chunks.push(revocationKey)
  chunks.push(OPS.OP_ELSE)
  chunks.push(intToNum(toSelfDelay))
  chunks.push(OP_CSV)
  chunks.push(OPS.OP_DROP)
  chunks.push(localDelayedKey)
  chunks.push(OPS.OP_ENDIF)
  chunks.push(OPS.OP_CHECKSIG)

  return SCRIPT.compile(chunks)
}

export let getToRemoteOutputScript = (remoteKey) => {
  // This output sends funds to the other peer, thus is a simple P2WPKH to remotekey.

  let chunks = []

  let sha = hash.sha256(remoteKey)
  let rip = hash.ripemd160(sha)

  chunks.push(OPS.OP_0)
  chunks.push(rip)

  return SCRIPT.compile(chunks)
}

export let hash160 = (data) => {
  let sha = hash.sha256(data)
  return hash.ripemd160(sha)
}

export let getOfferedHTLCOutput = (revocationKey, remoteKey, localKey, paymentHash) => {
  // # To you with revocation key
  //   OP_DUP OP_HASH160 <RIPEMD160(SHA256(revocationkey))> OP_EQUAL
  //   OP_IF
  //     OP_CHECKSIG
  //   OP_ELSE
  //     <remotekey> OP_SWAP OP_SIZE 32 OP_EQUAL
  //     OP_NOTIF
  //       # To me via HTLC-timeout transaction (timelocked).
  //       OP_DROP 2 OP_SWAP <localkey> 2 OP_CHECKMULTISIG
  //     OP_ELSE
  //       # To you with preimage.
  //       OP_HASH160 <RIPEMD160(payment_hash)> OP_EQUALVERIFY
  //       OP_CHECKSIG
  //     OP_ENDIF
  //   OP_ENDIF

  let chunks = []

  chunks.push(OPS.OP_DUP)
  chunks.push(OPS.OP_HASH160)
  chunks.push(hash160(revocationKey))
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_IF)

  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(remoteKey)
  chunks.push(OPS.OP_SWAP)
  chunks.push(OPS.OP_SIZE)
  chunks.push(Buffer.from('20', 'hex')) // Push <32> onto the stack
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_NOTIF)

  chunks.push(OPS.OP_DROP)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_SWAP)
  chunks.push(localKey)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_CHECKMULTISIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(OPS.OP_HASH160)
  chunks.push(paymentHash)
  chunks.push(OPS.OP_EQUALVERIFY)
  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ENDIF)
  chunks.push(OPS.OP_ENDIF)

  return SCRIPT.compile(chunks)
}

export let getReceivedHTLCOutput = (revocationKey, remoteKey, localKey, paymentHash, cltvTimeout) => {
  // # To you with revocation key
  // OP_DUP OP_HASH160 <RIPEMD160(SHA256(revocationkey))> OP_EQUAL
  // OP_IF
  //   OP_CHECKSIG
  // OP_ELSE
  //   <remotekey> OP_SWAP
  //   OP_SIZE 32 OP_EQUAL
  //   OP_IF
  //     # To me via HTLC-success transaction.
  //     OP_HASH160 <RIPEMD160(payment_hash)> OP_EQUALVERIFY
  //     2 OP_SWAP <localkey> 2 OP_CHECKMULTISIG
  //   OP_ELSE
  //     # To you after timeout.
  //     OP_DROP <cltv_expiry> OP_CHECKLOCKTIMEVERIFY OP_DROP
  //     OP_CHECKSIG
  //   OP_ENDIF
  // OP_ENDIF

  let chunks = []

  chunks.push(OPS.OP_DUP)
  chunks.push(OPS.OP_HASH160)
  chunks.push(hash160(revocationKey))
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_IF)

  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(remoteKey)
  chunks.push(OPS.OP_SWAP)
  chunks.push(OPS.OP_SIZE)
  chunks.push(Buffer.from('20', 'hex')) // Push <32> onto the stack
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_IF)

  chunks.push(OPS.OP_HASH160)
  chunks.push(paymentHash)
  chunks.push(OPS.OP_EQUALVERIFY)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_SWAP)
  chunks.push(localKey)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_CHECKMULTISIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(OPS.OP_DROP)
  chunks.push(intToNum(cltvTimeout))
  chunks.push(OPS.OP_CHECKLOCKTIMEVERIFY)
  chunks.push(OPS.OP_DROP)
  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ENDIF)
  chunks.push(OPS.OP_ENDIF)

  return SCRIPT.compile(chunks)
}

export let getHTLCFollowUpTx = (revocationKey, toSelfDelay, delayedKeyLocal) => {
  // OP_IF
  //   # Penalty transaction
  //   <revocationkey>
  // OP_ELSE
  //   `to_self_delay`
  //   OP_CSV
  //   OP_DROP
  //   <local_delayedkey>
  // OP_ENDIF
  // OP_CHECKSIG

  let chunks = []

  chunks.push(OPS.OP_IF)

  chunks.push(revocationKey)

  chunks.push(OPS.OP_ELSE)

  chunks.push(intToNum(toSelfDelay))
  chunks.push(OP_CSV)
  chunks.push(OPS.OP_DROP)
  chunks.push(delayedKeyLocal)

  chunks.push(OPS.OP_ENDIF)

  chunks.push(OPS.OP_CHECKSIG)

  return SCRIPT.compile(chunks)
}

export let wrapP2WSH = (script) => {
  let sha = hash.sha256(script)

  let chunks = []

  chunks.push(OPS.OP_0)
  chunks.push(sha)

  return SCRIPT.compile(chunks)
}