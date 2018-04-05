import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { formValueSelector, Field } from 'redux-form'

import { TextBox } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import { required } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, EmailHelper, ColRightInner } from 'components/BuySell/Signup'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const CancelText = styled.p`
  text-align: center;
  cursor: pointer;
  font-size: 14px;
`

class VerifyEmail extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.onSubmit = this.onSubmit.bind(this)
    this.resendCode = this.resendCode.bind(this)
  }

  componentDidMount () {
    if (this.props.ui.create === 'enter_email_code') {
      this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.oldEmail)
    }
    this.props.formActions.change('coinifyCreate', 'emailAddress', this.props.oldEmail)
  }

  componentDidUpdate (prevProps) {
    if (this.props.emailVerified && this.props.ui.uniqueEmail && !this.props.editVerified) this.props.updateUI({ create: 'create_account' })
    if (this.props.emailVerified && !prevProps.emailVerified) this.props.updateUI({ create: 'create_account' })
  }

  resendCode () {
    this.props.updateUI({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create === 'enter_email_code') {
      this.props.coinifyFrontendActions.coinifyClearSignupError()
      this.props.securityCenterActions.verifyEmailCode(this.props.emailCode)
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.securityCenterActions.updateEmail(this.props.emailAddress)
    }
  }

  render () {
    const { ui, invalid, emailVerifiedError } = this.props

    let emailHelper = () => {
      switch (true) {
        case emailVerifiedError: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.error' defaultMessage="That code doesn't match. {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
        case ui.codeSent: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.codeSent: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
      }
    }

    return (
      <Form onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.header.change_email' defaultMessage="What's your email?" />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.subheader.change_email' defaultMessage="Enter the email address you would like to use with your Coinify account. We'll send you a verification code to make sure it's yours." />
            </PartnerSubHeader>
            {
              ui.create === 'enter_email_code'
                ? <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedHTMLMessage id='coinifyexchangedata.create.verifyemail.code' defaultMessage='We emailed a verification code to {email}' values={{email: this.props.emailAddress}} />
                  </Text>
                  <Field name='emailCode' onChange={() => this.props.updateUI({ uniqueEmail: true })} component={TextBox} validate={[required]} />
                  <EmailHelper error={emailVerifiedError}>
                    { emailHelper() }
                  </EmailHelper>
                </EmailInput>
                : <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedMessage id='coinifyexchangedata.create.verifyemail.confirm' defaultMessage="Confirm Email:" />
                  </Text>
                  <Field name='emailAddress' component={TextBox} validate={[required]} />
                  <Button nature='primary' type='submit' disabled={!this.props.emailAddress} style={spacing('mt-15')}>
                    <FormattedMessage id='coinifyexchangedata.create.mobile.number' defaultMessage='Send Email Verification Code' />
                  </Button>
                </EmailInput>
            }
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            <ButtonWrapper>
              <Button type='submit' nature='primary' fullwidth uppercase disabled={invalid || ui.create !== 'enter_email_code' || !this.props.emailCode}>
                <FormattedMessage id='coinifyexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
              </Button>
              <CancelText onClick={() => this.props.updateUI({create: 'create_account'})}>Cancel</CancelText>
            </ButtonWrapper>
            {/* <FAQ1 /> */}
          </ColRightInner>
        </ColRight>
      </Form>
    )
  }
}

VerifyEmail.propTypes = {
  ui: PropTypes.object,
  invalid: PropTypes.boolean,
  updateUI: PropTypes.function,
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapStateToProps = (state) => ({
  emailCode: formValueSelector('coinifyCreate')(state, 'emailCode'),
  emailAddress: formValueSelector('coinifyCreate')(state, 'emailAddress'),
  oldEmail: selectors.core.settings.getEmail(state).data
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { codeSent: false } })
)

export default enhance(VerifyEmail)
