
import { START_UP } from './actionTypes'
import { storeOptions } from './actions'
import { takeEvery } from 'redux-saga'
import { put, select } from 'redux-saga/effects'
import * as random from 'crypto'
import {rootOptions} from './selectors'
import Long from 'long'
import {getRandomBytes, setStaticSeed, wrapHex} from '../helper'

var ec = require('bcoin/lib/crypto/secp256k1-browser')

export const LNRootSagas = () => {
  let INITIAL_OPTIONS = {
    chainHash: Buffer.from('43497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000', 'hex'),
    dustLimitSatoshis: 546,
    maxHtlcValueInFlightMsat: 100000,
    channelReserveSatoshis: 1000,
    feeRatePerKw: 10000,
    htlcMinimumMsat: 1,
    toSelfDelay: 60,
    maxAcceptedHtlcs: 100,
    minimumDepth: 1
  }
  const startUp = function * (action) {
    let options = yield select(rootOptions)
    if (options !== undefined) {
      return
    }
    options = INITIAL_OPTIONS
    let staticLocal = {}
    staticLocal.priv = getRandomBytes(32)
    staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)
    options.staticLocal = staticLocal

    yield put(storeOptions(options))
  }

  const takeSagas = function * () {
    yield takeEvery(START_UP, startUp)
  }

  return {
    takeSagas,
    startUp
  }
}
