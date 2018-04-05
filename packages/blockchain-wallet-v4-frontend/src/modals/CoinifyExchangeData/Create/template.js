import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { Row } from 'components/BuySell/Signup'

const Create = (props) => {
  const { handleSignup, signupError, ui } = props
  const { create } = ui

  const determineStep = () => {
    switch (create) {
      case 'create_account': return <AcceptTerms handleSignup={handleSignup} signupError={signupError} {...props} />

      case 'change_email':
      case 'enter_email_code': return <VerifyEmail {...props} />
    }
  }

  return (
    <Row>
      { determineStep() }
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired
}

export default reduxForm({ form: 'coinifyCreate' })(Create)
