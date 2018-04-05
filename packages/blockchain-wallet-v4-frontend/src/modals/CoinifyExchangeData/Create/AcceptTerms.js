import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { path } from 'ramda'
import { Field } from 'redux-form'
import { actions, selectors } from 'data'
import { CheckBox } from 'components/Form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button, HeartbeatLoader, Text, Link, Icon } from 'blockchain-info-components'
import FAQ1 from './faq.js'
import { spacing } from 'services/StyleService'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'

const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  font-weight: 400;
  a {
    color: ${props => props.theme['brand-secondary']}
  }
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const VerifiedContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const FieldBox = styled.div`
  border: 1px solid #DDDDDD;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  width: 85%;
  justify-content: space-between;
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

class AcceptTerms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      busy: false,
      acceptedTerms: false
    }

    this.handleSignup = this.handleSignup.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.signupError) {
      this.setState({ busy: false })
      this.props.updateUI({ uniqueEmail: false })
    }
  }

  handleSignup (e) {
    e.preventDefault()
    this.setState({ busy: true })
    this.props.coinifyFrontendActions.coinifySignup()
  }

  render () {
    const { busy } = this.state
    const { invalid, email, signupError, editEmail } = this.props

    return (
      <Form onSubmit={this.handleSignup}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='coinifyexchangedata.create.header' defaultMessage='Create Your Account' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedHTMLMessage id='coinifyexchangedata.create.createaccount.partner.subheader' defaultMessage="Your buy and sell experience is being streamlined. We've teamed up with Coinify to make your dreams of simply managing funds a reality." />
            </PartnerSubHeader>
            <PartnerSubHeader style={spacing('mt-10')}>
              <FormattedHTMLMessage id='coinifyexchangedata.create.createaccount.partner.subheader2' defaultMessage="Rest assured: there are only a few steps separating you from the good stuff. Let's start by confirming your verified email address." />
            </PartnerSubHeader>
            <FieldsContainer>
              <FieldContainer>
                <Text size='14px' style={spacing('mb-10')}>
                  <FormattedMessage id='coinifyexchangedata.create.createaccount.partner.verifiedemail' defaultMessage='Verified Email Address' />
                </Text>
                <VerifiedContainer>
                  <FieldBox>
                    <Text size='14px' weight={300}>
                      { email }
                    </Text>
                    <Link onClick={editEmail} size='14px' weight={300}>
                      <FormattedMessage id='coinifyexchangedata.create.createaccount.partner.edit' defaultMessage='edit' />
                    </Link>
                  </FieldBox>
                  <IconContainer>
                    <Icon name='checkmark-in-circle-filled' color='success' size='20px' />
                  </IconContainer>
                </VerifiedContainer>
              </FieldContainer>
            </FieldsContainer>
            <AcceptTermsContainer>
              <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
                <FormattedHTMLMessage id='coinifyexchangedata.create.accept.terms' defaultMessage="I accept Blockchain's <a>Terms of Service</a>, Coinify's <a>Terms of Service</a> & <a>Privary Policy</a>." />
              </Field>
            </AcceptTermsContainer>
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            <ButtonWrapper>
              <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid || busy || signupError}>
                {
                  !busy
                    ? <span>Continue</span>
                    : <HeartbeatLoader height='20px' width='20px' color='white' />
                }
              </Button>
            </ButtonWrapper>
            <ErrorWrapper>
              {
                signupError && <Text size='12px' color='error' weight={300} onClick={() => this.props.updateUI({ create: 'change_email' })}>
                  <FormattedHTMLMessage id='coinifyexchangedata.create.accept.error' defaultMessage='Unfortunately this email is being used for another account. <a>Click here</a> to change it.' />
                </Text>
              }
            </ErrorWrapper>
            <FAQ1 />
          </ColRightInner>
        </ColRight>
      </Form>
    )
  }
}

AcceptTerms.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  ui: PropTypes.object,
  email: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  signupError: path(['coinify', 'signupError'], state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(AcceptTerms)
