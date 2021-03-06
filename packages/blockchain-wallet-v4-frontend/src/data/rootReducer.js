
import { combineReducers } from 'redux'
import { reducer as reduxUiReducer } from 'redux-ui'
import { reducer as formReducer } from 'redux-form'
import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import alertsReducer from './alerts/reducers.js'
import authReducer from './auth/reducers.js'
import coinifyReducer from './modules/coinify/reducers.js'
import goalsReducer from './goals/reducers.js'
import modalsReducer from './modals/reducers.js'
import preferencesReducer from './preferences/reducers.js'
import scrollReducer from './scroll/reducers.js'
import sessionReducer from './session/reducers.js'
import wizardReducer from './wizard/reducers.js'
import settingsReducer from './modules/settings/reducers.js'
import sfoxSignupReducer from './modules/sfox/reducers.js'

const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  coinify: coinifyReducer,
  form: formReducer,
  goals: goalsReducer,
  modals: modalsReducer,
  preferences: preferencesReducer,
  scroll: scrollReducer,
  session: sessionReducer,
  ui: reduxUiReducer,
  wizard: wizardReducer,
  securityCenter: settingsReducer,
  sfoxSignup: sfoxSignupReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptions,
  [paths.kvStorePath]: coreReducers.kvStore
})

export default rootReducer
