import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import I18N, { language } from '../I18N/i18n'
import { numberValidation } from '../../helpers/helpers'
import { removeNPC, setErrors, updateChosenInitiative } from '../../store'
import InitiativeRoller from './initiative-roller'

export default function NPCInitiativeModal (props) {
    const dispatch = useDispatch()

    const {
        npcModifier,
        selectedNPCInitiative,
        selectedNPCName,
        setNpcModifier,
        setSelectedNPCInitiative,
        setSelectedNPCName,
        setShowInitiativeModal,
        showInitiativeModal
    } = props

    const updateNPCsInitiative = async (event) => {
        event.preventDefault()
        if (numberValidation(+selectedNPCInitiative)) {
            setShowInitiativeModal(false)
            await dispatch(updateChosenInitiative(+selectedNPCInitiative, selectedNPCName))
            setSelectedNPCInitiative('')
            setSelectedNPCName('')
        } else {
            dispatch(setErrors(language.initiativeOrder.enterValidInitiativevalue))
            setSelectedNPCInitiative('')
        }
    }

    return (
        <Modal
            show={ showInitiativeModal }
            onHide={ () => setShowInitiativeModal(false) }
            size="md"
            enforceFocus
            onExited={ () => {
                setSelectedNPCInitiative('')
                setNpcModifier('')
            } }
            style={{ textAlign: 'center' }}
        >
            <Modal.Header>
                <Modal.Title>
                    <I18N name="initiativeOrder.npcInitiativeModal.modifyNPC" npcName={ selectedNPCName } />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InitiativeRoller
                    setModifierValue={ setNpcModifier }
                    modifierValue={ npcModifier }
                    setInitiativeValue={ setSelectedNPCInitiative }
                    initiativeValue={ selectedNPCInitiative }
                    submitInitiativeValue={ async(e) => await updateNPCsInitiative(e) }
                />
                <Button
                    onClick={ async () => {
                        await dispatch(removeNPC(selectedNPCName))
                        setShowInitiativeModal(false)
                    } }
                    variant="danger"
                >
                    <I18N name="initiativeOrder.npcInitiativeModal.removeNPC" npcName={ selectedNPCName } />
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={ () => setShowInitiativeModal(false) }
                >
                    <I18N name="common.close" />
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

NPCInitiativeModal.propTypes = {
    npcModifier: PropTypes.string,
    selectedNPCInitiative: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    selectedNPCName: PropTypes.string,
    setNpcModifier: PropTypes.func,
    setSelectedNPCInitiative: PropTypes.func,
    setSelectedNPCName: PropTypes.func,
    setShowInitiativeModal: PropTypes.func,
    showInitiativeModal: PropTypes.bool
}
