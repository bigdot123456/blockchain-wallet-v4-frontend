import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getData, getAddresses } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillMount () {
    // Make request to shapeShift to create order
    const { pair, sourceAddress, sourceAmount, targetAddress } = this.props
    this.props.dataShapeshiftActions.fetchOrder(sourceAmount, pair, sourceAddress, targetAddress)
  }

  handleSubmit () {
    // Submit exchange
    console.log('Submit to exchange')
  }

  handleCancel () {
    // Reset form and go back to first step
    this.props.formActions.reset('exchange')
    this.props.previousStep()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        {...this.props}
        {...value}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
        handleExpiry={this.handleCancel}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Success />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...getAddresses(state, ownProps.source, ownProps.target),
  data: getData(state, ownProps.sourceCoin, ownProps.targetCoin)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
