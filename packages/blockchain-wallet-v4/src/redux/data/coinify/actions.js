import * as AT from './actionTypes'

export const fetchQuote = (data) => ({ type: AT.COINIFY_FETCH_QUOTE, payload: data })
export const fetchQuoteLoading = () => ({ type: AT.COINIFY_FETCH_QUOTE_LOADING })
export const fetchQuoteSuccess = (data) => ({ type: AT.COINIFY_FETCH_QUOTE_SUCCESS, payload: data })
export const fetchQuoteFailure = (error) => ({ type: AT.COINIFY_FETCH_QUOTE_FAILURE, payload: error })

export const fetchQuoteAndMediums = (data) => ({ type: AT.COINIFY_FETCH_QUOTE_AND_MEDIUMS, payload: data })

export const fetchRateQuote = (curr) => ({ type: AT.COINIFY_FETCH_RATE_QUOTE, payload: curr })
export const fetchRateQuoteLoading = () => ({ type: AT.COINIFY_FETCH_RATE_QUOTE_LOADING })
export const fetchRateQuoteSuccess = (data) => ({ type: AT.COINIFY_FETCH_RATE_QUOTE_SUCCESS, payload: data })
export const fetchRateQuoteFailure = (error) => ({ type: AT.COINIFY_FETCH_RATE_QUOTE_FAILURE, payload: error })

export const fetchTrades = (data) => ({ type: AT.COINIFY_FETCH_TRADES, payload: data })
export const fetchTradesLoading = () => ({ type: AT.COINIFY_FETCH_TRADES_LOADING })
export const fetchTradesSuccess = (data) => ({ type: AT.COINIFY_FETCH_TRADES_SUCCESS, payload: data })
export const fetchTradesFailure = (error) => ({ type: AT.COINIFY_FETCH_TRADES_FAILURE, payload: error })

export const fetchProfile = () => ({ type: AT.COINIFY_FETCH_PROFILE })
export const fetchProfileLoading = () => ({ type: AT.COINIFY_FETCH_PROFILE_LOADING })
export const fetchProfileSuccess = (data) => ({ type: AT.COINIFY_FETCH_PROFILE_SUCCESS, payload: data })
export const fetchProfileFailure = (error) => ({ type: AT.COINIFY_FETCH_PROFILE_FAILURE, payload: error })

export const coinifyHandleTrade = (data) => ({ type: AT.COINIFY_HANDLE_TRADE, payload: data })
export const coinifyHandleTradeLoading = () => ({ type: AT.COINIFY_HANDLE_TRADE_LOADING })
export const coinifyHandleTradeSuccess = (data) => ({ type: AT.COINIFY_HANDLE_TRADE_SUCCESS, payload: data })
export const coinifyHandleTradeFailure = (error) => ({ type: AT.COINIFY_HANDLE_TRADE_FAILURE, payload: error })

export const setProfile = (data) => ({ type: AT.SET_PROFILE, payload: data })
export const setProfileSuccess = (data) => ({ type: AT.SET_PROFILE_SUCCESS, payload: data })
export const setProfileFailure = (error) => ({ type: AT.SET_PROFILE_FAILURE, payload: error })

export const signup = () => ({ type: AT.SIGNUP })
export const coinifySignupSuccess = (data) => ({ type: AT.COINIFY_SIGNUP_SUCCESS, payload: data })
export const coinifySignupFailure = (error) => ({ type: AT.COINIFY_SIGNUP_FAILURE, payload: error })

export const resetProfile = () => ({ type: AT.RESET_PROFILE })

export const getDelegateTokenSuccess = (token) => ({ type: AT.GET_DELEGATE_TOKEN_SUCCESS, token })

export const coinifySetToken = (token) => ({ type: AT.COINIFY_SET_TOKEN, payload: token })

export const getPaymentMediums = (quote) => ({ type: AT.GET_PAYMENT_MEDIUMS, payload: quote })
export const getPaymentMediumsLoading = () => ({ type: AT.GET_PAYMENT_MEDIUMS_LOADING })
export const getPaymentMediumsSuccess = (mediums) => ({ type: AT.GET_PAYMENT_MEDIUMS_SUCCESS, payload: mediums })
export const getPaymentMediumsFailure = (error) => ({ type: AT.GET_PAYMENT_MEDIUMS_FAILURE, payload: error })

export const getMediumAccounts = (medium) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS, payload: medium })
export const getMediumAccountsSuccess = (accounts) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_SUCCESS, payload: accounts })
export const getMediumAccountsFailure = (error) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_FAILURE, payload: error })

export const triggerKycLoading = () => ({ type: AT.TRIGGER_KYC_LOADING })
export const triggerKycSuccess = (kyc) => ({ type: AT.TRIGGER_KYC_SUCCESS, payload: kyc })
export const triggerKycError = (error) => ({ type: AT.TRIGGER_KYC_ERROR, payload: error })
