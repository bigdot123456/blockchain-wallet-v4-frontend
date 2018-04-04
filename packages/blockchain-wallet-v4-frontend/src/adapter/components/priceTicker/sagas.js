import { takeEvery, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'

const initialized = function * (action) {
  try {
    const { coin } = action.payload
    switch (coin) {
      case 'BCH': return yield put(actions.data.bch.fetchRates())
      case 'BTC': return yield put(actions.data.btc.fetchRates())
      case 'ETH': return yield put(actions.data.eth.fetchRates())
      default: throw new Error(`Could not fetch rates for coin ${coin}.`)
    }
  } catch (e) {
    // yield put(actions.alerts.displayError('Price index series chart could not be initialized.'))
  }
}

export default function * () {
  yield takeEvery(AT.PRICE_TICKER_INITIALIZED, initialized)
}
