import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'adapter'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ThirdStepContainer extends React.Component {
  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        sourceCoin={value.sourceCoin}
        sourceAmount={value.sourceAmount}
        status={value.status}
        exchangeRate={value.exchangeRate}
        transactionFee={value.transactionFee}
        orderId={value.orderId}
        depositAmount={value.depositAmount}
        withdrawalAmount={value.withdrawalAmount}
        handleClose={() => this.props.actions.thirdStepCloseClicked()}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Success />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStepContainer)
