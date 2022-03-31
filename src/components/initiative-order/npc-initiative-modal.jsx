import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { removeNPC, setErrors, updateChosenInitiative } from '../../store/store'
import { GENERAL, INITIATIVE_PAGE } from '../../helpers/language-map'
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
        if (!isNaN(+selectedNPCInitiative)) {
            setShowInitiativeModal(false)
            await dispatch(updateChosenInitiative(+selectedNPCInitiative, selectedNPCName))
            setSelectedNPCInitiative('')
            setSelectedNPCName('')
        } else {
            dispatch(setErrors('Please enter a valid initiative value in numeric format.'))
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
                    { `${ INITIATIVE_PAGE.modify } ${ selectedNPCName }` }
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
                    { `${ GENERAL.remove } ${ selectedNPCName }` }
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={ () => setShowInitiativeModal(false) }
                >
                    { GENERAL.close }
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
