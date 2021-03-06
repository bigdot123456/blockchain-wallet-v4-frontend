import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const selectStyle = status => {
  switch (status) {
    case 'complete': return { color: 'success', italic: false }
    case 'failed': return { color: 'error', italic: false }
    case 'no_deposits': return { color: 'gray-6', italic: true }
    case 'received': return { color: 'gray-6', italic: true }
    case 'resolved': return { color: 'green', italic: false }
  }
}

const renderStatus = status => {
  switch (status) {
    case 'complete': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.complete' defaultMessage='Complete' />
    case 'failed': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.failed' defaultMessage='Failed' />
    case 'no_deposits': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.inprogress' defaultMessage='In progress' />
    case 'received': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.pending' defaultMessage='Pending' />
    case 'resolved': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.refunded' defaultMessage='Refunded' />
    default: return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.unknown' defaultMessage='Unknown' />
  }
}

const OrderStatus = props => {
  const { status } = props
  const style = selectStyle(status)

  return (
    <Text size='14px' weight={300} {...style}>
      {renderStatus(status)}
    </Text>
  )
}

export default OrderStatus
