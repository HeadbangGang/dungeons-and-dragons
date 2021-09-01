import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { InputGroup, FormControl, Button, Row, Form, Modal } from 'react-bootstrap'
import { removeNPC, updateChosenInitiative, setError } from '../../store/store'
import { GENERAL, INITIATIVE_PAGE } from '../../language-map'

export default function NPCInitiativeModal (props) {
    const dispatch = useDispatch()

    NPCInitiativeModal.propTypes = {
        initiativeModifierHandler: PropTypes.func,
        npcModifier: PropTypes.string,
        numberValidation: PropTypes.func,
        selectedNPCInitiative: PropTypes.string,
        selectedNPCName: PropTypes.string,
        setNpcModifer: PropTypes.func,
        setSelectedNPCInitiative: PropTypes.func,
        setSelectedNPCName: PropTypes.func,
        setShowInitiativeModal: PropTypes.func,
        showInitiativeModal: PropTypes.bool
    }

    const {
        initiativeModifierHandler,
        npcModifier,
        numberValidation,
        selectedNPCInitiative,
        selectedNPCName,
        setNpcModifer,
        setSelectedNPCInitiative,
        setSelectedNPCName,
        setShowInitiativeModal,
        showInitiativeModal
    } = props

    const updateNPCsInitiative = (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            setShowInitiativeModal(false)
            dispatch(updateChosenInitiative(initiativeToNum, selectedNPCName))
            setSelectedNPCInitiative('')
            setSelectedNPCName('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setSelectedNPCInitiative('')
        }
    }

    return (
        <Modal
            show={ showInitiativeModal }
            onHide={ () => setShowInitiativeModal(false) }
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            enforceFocus
            onExited={ () => {
                setSelectedNPCInitiative('')
                setNpcModifer('')
            } }
            style={{ textAlign: 'center' }}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {`${ INITIATIVE_PAGE.edit } ${ selectedNPCName }`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Form onSubmit={ (e) => initiativeModifierHandler(e, 'npc-initiative-submit', 'npc-edit') }>
                        <InputGroup className="mb-3 mt-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                        Modifier
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                className='initiative-order-initiative-modifier'
                                maxLength='2'
                                placeholder='0'
                                onChange={ (e) => {
                                    if (numberValidation(e.target.value)) {
                                        setNpcModifer(e.target.value)
                                    }
                                } }
                                type="tel"
                                value={ npcModifier }
                            />
                            <Button className="ml-3" onClick={ (e) => initiativeModifierHandler(e, 'npc-initiative-submit', 'npc-edit') }>
                            Roll Inititiative
                            </Button>
                        </InputGroup>
                    </Form>
                </Row>
                <Row>
                    <Form onSubmit={ (e) => updateNPCsInitiative(e) }>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    { INITIATIVE_PAGE.initiative }
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                className='initiative-order-initiative-input'
                                maxLength='2'
                                onChange={ (e) => {
                                    if (numberValidation(e.target.value)) {
                                        setSelectedNPCInitiative(e.target.value)
                                    }
                                } }
                                type="tel"
                                value={ selectedNPCInitiative }
                            />
                            <Button className='ml-3' disabled={ !selectedNPCInitiative } type='submit' id='npc-initiative-submit' onClick={ (e) => updateNPCsInitiative(e) }>
                                { GENERAL.submit }
                            </Button>
                        </InputGroup>
                    </Form>
                </Row>
                <Row>
                    <Button
                        onClick={ () => {
                            dispatch(removeNPC(selectedNPCName))
                            setShowInitiativeModal(false)
                        } }
                        variant='danger'
                    >
                        {`${ GENERAL.remove } ${ selectedNPCName }`}
                    </Button>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ () => setShowInitiativeModal(false) }>
                    { GENERAL.close }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}