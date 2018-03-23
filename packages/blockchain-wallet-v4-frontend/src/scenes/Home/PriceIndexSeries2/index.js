import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { assoc } from 'ramda'

import { Text } from 'blockchain-info-components'
import Chart from './Chart'
import CoinFilters from './CoinFilters'
import TimeFilters from './TimeFilters'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};

  & > * { margin-bottom: 10px; }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const PriceIndexSeries = props => (
  <Wrapper>
    <Row>
      <Text size='24px' weight={300} color='brand-primary' uppercase>
        <FormattedMessage id='scenes.home.priceindexseries' defaultMessage='Price chart' />
      </Text>
      <TimeFilters />
    </Row>
    <Row>
      <Chart />
    </Row>
    <Row>
      <CoinFilters />
    </Row>
  </Wrapper>
)

export default PriceIndexSeries