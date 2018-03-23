import { concat, lift, path } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getStep = path(['adapter', 'components', 'exchange', 'step'])

export const getDataFirstStep = state => {
  const btcHDAccountsInfo = selectors.core.common.bitcoin.getAccountsInfo(state)
  const btcAddressesInfo = selectors.core.common.bitcoin.getAddressesInfo(state)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfoR = selectors.core.common.ethereum.getAccountsInfo(state)
  const effectiveBalance = 0

  const transform = (ethAccountsInfo) => {
    const elements = [
      { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
    ]

    return {
      elements,
      effectiveBalance
    }
  }

  return lift(transform)(ethAccountsInfoR)
}

// export const getData = state => {

//   const defaultBtcAccount = head(btcAccountsInfo)
//   const defaultEthAccount = head(ethAccountsInfo)
//   const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
//   const accounts = formValueSelector('exchange')(state, 'accounts')
//   const amount = formValueSelector('exchange')(state, 'amount')
//   const source = prop('source', accounts)
//   const sourceAmount = prop('source', amount)
//   const sourceCoin = prop('coin', source) || 'BTC'
//   const target = prop('target', accounts)
//   const targetAmount = prop('target', amount)
//   const targetCoin = prop('coin', target) || 'ETH'
//   const pair = getPairFromCoin(sourceCoin, targetCoin)
//   const defaultAccounts = {
//     BTC: defaultBtcAccount,
//     ETH: defaultEthAccount
//   }

//   return ({
//     defaultAccounts,
//     initialValues: {
//       accounts: { source: defaultBtcAccount, target: defaultEthAccount },
//       amount: { source: '0', target: '0' }
//     },
//     elements: [
//       { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
//       { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
//     ],
//     btcAccountsInfo,
//     ethAccountsInfo,
//     currency,
//     source,
//     sourceCoin,
//     sourceAmount,
//     target,
//     targetCoin,
//     targetAmount,
//     pair
//   })
// }

// export const getData = state => {
  // const transform = () => {
  
  //   return {
  //     elements:
  //     sourceAccount:
  //     targetAccount:
  //     sourceAmount: {
  //       coinValue:
  //       coinUnit:
  //       fiatValue:
  //       fiatUnit:
  //     },
  //     targetAmout: {
  //       coinValue:
  //       coinUnit:
  //       fiatValue:
  //       fiatUnit:
  //     },
  //     effectiveBalance
  //   }
  // }

  // return lift(transform)()
//   return 'test'
// }
