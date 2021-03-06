import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Faq from './Faq'
import WhatsNew from './WhatsNew'
import Refresh from './Refresh'
import Logout from './Logout'

import { Image } from 'blockchain-info-components'
import { Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNav, NavbarNavItem, NavbarToggler } from 'components/Navbar'

const MenuLeftToggler = styled(NavbarToggler)`
  left: 20px;
`

const Header = (props) => {
  const { navigationToggled, handleToggleNavigation, handleTrayRightToggle, handleToggleMenuLeft, trayRightOpen } = props

  return (
    <Navbar height='60px'>
      <MenuLeftToggler onToggle={handleToggleMenuLeft} />
      <NavbarHeader>
        <NavbarBrand>
          <NavLink to='/'>
            <Image name='blockchain-vector' height='20px' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenu toggled={navigationToggled}>
        <div />
        <NavbarNav>
          <NavbarNavItem>
            <Faq onClick={handleTrayRightToggle} trayRightOpen={trayRightOpen}/>
          </NavbarNavItem>
          <NavbarNavItem>
            <WhatsNew />
          </NavbarNavItem>
          <NavbarNavItem>
            <Refresh />
          </NavbarNavItem>
          <NavbarNavItem>
            <Logout />
          </NavbarNavItem>
        </NavbarNav>
      </NavbarMenu>
      <NavbarToggler onToggle={handleToggleNavigation} />
    </Navbar>
  )
}

Header.propTypes = {
  handleToggleNavigation: PropTypes.func.isRequired,
  handleToggleMenuLeft: PropTypes.func.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired,
  navigationToggled: PropTypes.bool.isRequired,
  trayRightOpen: PropTypes.bool.isRequired
}

export default Header
