import React from 'react'
import styled from 'styled-components'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { RadioButton, Form } from 'components/Form'
import ImportInternalBtcAddress from './ImportInternalBtcAddress'
import ImportExternalBtcAddress from './ImportExternalBtcAddress'

const Wrapper = styled.div`
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 15px;
`
const RadioContainer = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
`

const ImportBtcAddress = (props) => {
  const { position, close, submitting, invalid, addressType, ...rest } = props
  const { onSubmit } = rest

  return (
    <Modal size='large' position={position}>
      <Form onSubmit={onSubmit}>
        <Wrapper>
          <ModalHeader icon='up-arrow-in-circle' onClose={close}>
            <FormattedMessage id='modals.importbtcaddress.title' defaultMessage='Import Existing Bitcoin Address' />
          </ModalHeader>
          <ModalBody>
            <Title>
              <FormattedMessage id='modals.importbtcaddress.import_type' defaultMessage='What do you want to import?' />
            </Title>
            <RadioContainer>
              <Field name='address-type' value='internal' props={{id: 'internal', value: 'internal'}} validate={[]} component={RadioButton}>
                <FormattedHTMLMessage id='modals.importbtcaddress.generated_in_wallet' defaultMessage='Existing address generated in <span style="font-weight: bold;">this wallet</span>.' />
              </Field>
            </RadioContainer>
            <RadioContainer>
              <Field name='address-type' value='external' props={{id: 'external', value: 'external'}} validate={[]} component={RadioButton}>
                <FormattedHTMLMessage id='modals.importbtcaddress.generated_outside_wallet' defaultMessage='Existing address generated <span style="font-weight: bold;">outside this wallet</span>.' />
              </Field>
            </RadioContainer>
            { addressType === 'internal' && <ImportInternalBtcAddress /> }
            { addressType === 'external' && <ImportExternalBtcAddress /> }
          </ModalBody>
          {
            addressType === 'external' && (
              <ModalFooter align='right'>
                <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
                  <FormattedMessage id='modals.importbtcaddress.button' defaultMessage='Import' />
                </Button>
              </ModalFooter>
            )
          }
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'importBtcAddress' })(ImportBtcAddress)
