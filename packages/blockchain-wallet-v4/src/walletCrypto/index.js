import * as crypto from 'crypto'
import { pbkdf2, pbkdf2Sync } from 'pbkdf2'
import assert from 'assert'
import Task from 'data.task'
import * as U from './utils'
import { curry } from 'ramda'
import Either from 'data.either'

const SUPPORTED_ENCRYPTION_VERSION = 3

export const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

// decryptWallet :: Password -> PayloadJSON -> Either Error JSON
export const decryptWallet = curry((password, data) => Either.try(decryptWalletSync)(password, data))

export const decryptWalletSync = (password, data) => {
  assert(data, 'function `decryptWallet` requires encrypted wallet data')
  assert(password, 'function `decryptWallet` requires a password')

  let wrapper, version, decrypted

  try {
    wrapper = JSON.parse(data)
  } catch (e) {
    version = 1
  }

  if (wrapper) {
    assert(wrapper.payload, 'v2 Wallet error: missing payload')
    assert(wrapper.pbkdf2_iterations, 'v2 Wallet error: missing pbkdf2 iterations')
    assert(wrapper.version, 'v2 Wallet error: missing version')
    version = wrapper.version
  }

  if (version > SUPPORTED_ENCRYPTION_VERSION) {
    throw new Error('Wallet version ' + version + ' not supported.')
  }

  try {
    // v2/v3: CBC, ISO10126, iterations in wrapper
    decrypted = decryptDataWithPasswordSync(wrapper.payload, password, wrapper.pbkdf2_iterations)
    decrypted = JSON.parse(decrypted)
  } catch (e) {
    decrypted = decryptWalletV1(data, password)
  } finally {
    assert(decrypted, 'Error decrypting wallet, please check that your password is correct')
  }

  return decrypted
}

export const decryptWalletV1 = (data, password) => {
  // Possible decryption methods for v1 wallets
  let decryptFns = [
    // v1: CBC, ISO10126, 10 iterations
    decryptDataWithPasswordSync.bind(null, data, password, 10),

    // v1: OFB, nopad, 1 iteration
    decryptDataWithPasswordSync.bind(null, data, password, 1, {
      mode: U.AES.OFB,
      padding: U.NoPadding
    }),

    // v1: OFB, ISO7816, 1 iteration
    // ISO/IEC 9797-1 Padding method 2 is the same as ISO/IEC 7816-4:2005
    decryptDataWithPasswordSync.bind(null, data, password, 1, {
      mode: U.AES.OFB,
      padding: U.Iso97971
    }),

    // v1: CBC, ISO10126, 1 iteration
    decryptDataWithPasswordSync.bind(null, data, password, 1, {
      mode: U.AES.CBC,
      padding: U.Iso10126
    })
  ]

  return decryptFns.reduce((acc, decrypt) => {
    if (acc) return acc
    try {
      return JSON.parse(decrypt())
    } catch (e) {
      return null
    }
  }, null)
}

export const encryptWallet = curry((data, password, pbkdf2Iterations, version) => {
  assert(data, 'data missing')
  assert(password, 'password missing')
  assert(pbkdf2Iterations, 'pbkdf2Iterations missing')
  assert(version, 'version missing')

  return JSON.stringify({
    pbkdf2_iterations: pbkdf2Iterations,
    version: version,
    payload: encryptDataWithPasswordSync(data, password, pbkdf2Iterations)
  })
})

// stretchPassword :: password -> salt -> iterations -> keylen -> Task Error Buffer
function stretchPassword (password, salt, iterations, keyLenBits) {
  assert(salt, 'salt missing')
  assert(password && typeof password === 'string', 'password string required')
  assert(typeof iterations === 'number' && iterations > 0, 'positive iterations number required')
  assert(keyLenBits == null || keyLenBits % 8 === 0, 'key length must be evenly divisible into bytes')

  const saltBuffer = Buffer.from(salt, 'hex')
  const keyLenBytes = (keyLenBits || 256) / 8

  return new Task((reject, resolve) => {
    pbkdf2(password, saltBuffer, iterations, keyLenBytes, 'sha1', (error, key) => {
      if (error) reject(error)
      else resolve(key)
    })
  })
}

// stretchPasswordSync :: password -> salt -> iterations -> keylen -> Buffer
function stretchPasswordSync (password, salt, iterations, keyLenBits) {
  assert(salt, 'salt missing')
  assert(password && typeof password === 'string', 'password string required')
  assert(typeof iterations === 'number' && iterations > 0, 'positive iterations number required')
  assert(keyLenBits == null || keyLenBits % 8 === 0, 'key length must be evenly divisible into bytes')

  const saltBuffer = Buffer.from(salt, 'hex')
  const keyLenBytes = (keyLenBits || 256) / 8

  return pbkdf2Sync(password, saltBuffer, iterations, keyLenBytes, 'sha1')
}

// decryptDataWithPassword :: data -> password -> iterations -> options -> Task Error Buffer
function decryptDataWithPassword (data, password, iterations, options) {
  if (!data) return Task.of(data)
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')

  let dataHex = Buffer.from(data, 'base64')
  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
  let salt = iv

  return stretchPassword(password, salt, iterations, U.KEY_BIT_LEN).map((key) => {
    return decryptBufferWithKey(payload, iv, key, options)
  })
}

// decryptDataWithPasswordSync :: data -> password -> iterations -> options -> Buffer
export function decryptDataWithPasswordSync (data, password, iterations, options) {
  if (!data) { return data }
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')

  let dataHex = Buffer.from(data, 'base64')
  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
  //  AES initialization vector is also used as the salt in password stretching
  let salt = iv
  // Expose stretchPassword for iOS to override
  let key = stretchPasswordSync(password, salt, iterations, U.KEY_BIT_LEN)

  return decryptBufferWithKey(payload, iv, key, options)
}

export const stringToKey = (string, iterations) => stretchPasswordSync(string, 'salt', iterations, U.KEY_BIT_LEN)

// payload: (Buffer)
// iv: initialization vector (Buffer)
// key: AES key (256 bit Buffer)
// options: (optional)
// returns: decrypted payload (e.g. a JSON string)
function decryptBufferWithKey (payload, iv, key, options) {
  options = options || {}
  options.padding = options.padding || U.Iso10126

  let decryptedBytes = U.AES.decrypt(payload, key, iv, options)

  return decryptedBytes.toString('utf8')
}

function encryptDataWithPassword (data, password, iterations) {
  if (!data) return Task.of(data)
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')
  let salt = crypto.randomBytes(U.SALT_BYTES)

  return stretchPassword(password, salt, iterations, U.KEY_BIT_LEN).map((key) => {
    return exports.encryptDataWithKey(data, key, salt)
  })
}

export function encryptDataWithPasswordSync (data, password, iterations) {
  if (!data) { return data }
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')

  let salt = crypto.randomBytes(U.SALT_BYTES)
  let key = stretchPasswordSync(password, salt, iterations, U.KEY_BIT_LEN)

  return exports.encryptDataWithKey(data, key, salt)
}

// data: e.g. JSON.stringify({...})
// key: AES key (256 bit Buffer)
// iv: optional initialization vector
// returns: concatenated and Base64 encoded iv + payload
export let encryptDataWithKey = curry((data, key, iv) => {
  let IV = iv || crypto.randomBytes(U.SALT_BYTES)
  let dataBytes = Buffer.from(data, 'utf8')
  let options = { mode: U.AES.CBC, padding: U.Iso10126 }
  let encryptedBytes = U.AES.encrypt(dataBytes, key, IV, options)
  let payload = Buffer.concat([ IV, encryptedBytes ])
  return payload.toString('base64')
})

export const decryptDataWithKey = curry((data, key) => {
  let dataHex = Buffer.from(data, 'base64')
  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
  return decryptBufferWithKey(payload, iv, key)
})

const checkFailure = curry((pass, fail, str) => str === '' ? fail(new Error('DECRYPT_FAILURE')) : pass(str))

export const encryptSecPass = curry((sharedKey, pbkdf2Iterations, password, message) =>
  encryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations))

export const encryptSecPassSync = curry((sharedKey, pbkdf2Iterations, password, message) =>
  Either.try(() => encryptDataWithPasswordSync(message, sharedKey + password, pbkdf2Iterations))())

export const decryptSecPass = curry((sharedKey, pbkdf2Iterations, password, message) =>
  decryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations)
    .chain(checkFailure(Task.of, Task.rejected)))

export const decryptSecPassSync = curry((sharedKey, pbkdf2Iterations, password, message) =>
  Either.try(() => decryptDataWithPasswordSync(message, sharedKey + password, pbkdf2Iterations))()
    .chain(checkFailure(Either.of, Either.Left)))

export const hashNTimes = curry((iterations, data) => {
  assert(iterations > 0, '`iterations` must be a number greater than 0')
  while (iterations--) data = sha256(data)
  return data
})

export const isStringHashInFraction = (str, fraction) => {
  if (!str) return false
  if (fraction < 0) return false
  return (crypto.sha256(str)[0] / 256) >= (1 - fraction)
}
