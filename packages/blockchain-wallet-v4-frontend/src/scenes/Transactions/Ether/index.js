import React from 'react'
import styled from 'styled-components'

import Menu from './Menu'
import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

const EtherTransactionsContainer = (props) => {
  return (
    <Wrapper>
      <Menu />
      <Content />
    </Wrapper>
  )
}

export default EtherTransactionsContainer
