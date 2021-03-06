import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  display: ${props => props.toggled ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  background-color: inherit;

  @media(min-width: 768px) {
    position: relative;
    top: initial;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const NavbarMenu = props => {
  const { children, ...rest } = props

  return (
    <BaseMenu {...rest}>
      {children}
    </BaseMenu>
  )
}

NavbarMenu.propTypes = {
  toggled: PropTypes.bool
}

NavbarMenu.defaultProps = {
  toggled: false
}

export default NavbarMenu
