import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > * { margin-left: 5px; }
`

const MinimumMaximum = props => (
  <Wrapper>
    <Text weight={300} size='12px'>
      <FormattedMessage id='scenes.exchangebox.firststep.use1' defaultMessage='Use' />
    </Text>
    <Link size='12px' weight={300} onClick={props.handleMinimum}>
      <FormattedMessage id='scenes.exchangebox.firststep.min' defaultMessage='minimum' />
    </Link>
    <Text weight={300} size='12px'>
      <FormattedMessage id='scenes.exchangebox.firststep.use2' defaultMessage='| Use' />
    </Text>
    <Link size='12px' weight={300} onClick={props.handleMaximum}>
      <FormattedMessage id='scenes.exchangebox.firststep.max' defaultMessage='maximum' />
    </Link>
  </Wrapper>
)

MinimumMaximum.propTypes = {
  handleMinimum: PropTypes.func.isRequired,
  handleMaximum: PropTypes.func.isRequired
}

export default MinimumMaximum
