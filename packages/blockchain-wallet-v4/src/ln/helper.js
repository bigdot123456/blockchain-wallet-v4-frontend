const assert = require('assert')
const secp = require('bcoin/lib/crypto/secp256k1')
const Long = require('long')

export let assertPubKey = pubKey => {
  assert.equal(pubKey.length, 33)
}

export let assertSignature = sig => {
  assert.equal(sig.length, 64)
}

export let assertNumber = num => {
  assert.equal(typeof num, 'number')
}

export let assertLong = num => {
  assert(Long.isLong(num))
}

export let assertBuffer = buf => {
  assert(Buffer.isBuffer(buf))
}

export let addSighash = sig => Buffer.concat([sig, wrapHex('01')])
export let wrapHex = hex => Buffer.from(hex, 'hex')

export let toDER = sig => secp.toDER(sig)
export let fromDER = sig => secp.fromDER(sig)
export let sigToBitcoin = sig => addSighash(toDER(sig))

export let identity = a => a

export let copy = obj => Object.assign({}, obj)

export function makeActionCreator (type, ...argNames) {
  return function (...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}