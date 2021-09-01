import React, { useState } from 'react'
import Immutable from 'immutable'
import { InputGroup, FormControl, Button, Col, Row, Form, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {
    getActiveGameData,
    getActiveGameId,
    getCurrentUser,
    resetInitiative,
    setError,
    updateActiveGameData,
    updateChosenInitiative,
} from '../../store/store'
import NPCInitiativeModal from './npc-initiative-model'
import spinner from '../../media/spinner.webp'
import { GENERAL, INITIATIVE_PAGE } from '../../language-map'
import './initiative-order.css'

export const InitiativeOrder = () => {
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)
    const gameData = useSelector(getActiveGameData)
    const gameId = useSelector(getActiveGameId)

    const [initiativeValue, setInitiativeValue] = useState('')
    const [npcName, setNpcName] = useState('')
    const [npcInitiative, setNpcInitiative] = useState('')
    const [showInitiativeModal, setShowInitiativeModal] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [resetInitiativeGroup, setResetInitiativeGroup] = useState(null)
    const [selectedNPCName, setSelectedNPCName] = useState('')
    const [selectedNPCInitiative, setSelectedNPCInitiative] = useState('')
    const [npcModifier, setNpcModifer] = useState('')
    const [playerModifier, setPlayerModifier] = useState('')
    const [newNpcModifier, setNewNpcModifier] = useState('')
    const [showSpinner, setShowSpinner] = useState(false)

    const isAdmin = userData.get('admin', false)
    const currentUid = userData.get('uid')
    const isUserDM = gameData.getIn(['players', currentUid, 'gameMaster'])

    const sortedPlayers = gameData?.get('players')?.filter(x => !x.get('gameMaster')).sortBy(x => -x.get('initiativeValue')) ?? Immutable.List()
    const allNPCs = gameData.get('players')?.map(player => {
        return player.get('NPC')
    }) ?? Immutable.List()

    const updatePlayersInitiative = async (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(initiativeValue || selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            dispatch(updateChosenInitiative(initiativeToNum, userData.get('uid')))
            setInitiativeValue('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setInitiativeValue('')
        }
    }

    const addNPC = async (e) => {
        e.preventDefault()
        const cleanNpc = npcName.trim()
        const initiativeToNum = parseInt(npcInitiative)
        if (!isNaN(initiativeToNum) && cleanNpc !== '' && gameData.get('players')?.filter(x => x.get('characterName') === cleanNpc).size < 1) {
            dispatch(updateActiveGameData(gameId, cleanNpc, true, initiativeToNum))
            setNpcName('')
            setNpcInitiative('')
        } else {
            if (cleanNpc === '') {
                dispatch(setError('Please enter a valid NPC name.'))
                setNpcName('')
            } else if (gameData.get('players')?.filter(x => x.get('characterName') === cleanNpc).size > 0) {
                dispatch(setError('This character already exists. Please use a different NPC name.'))
                setNpcName('')
            } else {
                dispatch(setError('Please enter a valid initiative value in numeric format.'))
                setNpcInitiative('')
            }
        }
    }

    const numberValidation = (val) => {
        let valid
        if(!/^[0-9]+$/.test(val) && val !== ''){
            valid = false
            setNpcModifer('')
        } else {
            valid = true
        }
        return valid
    }

    const initiativeModifierHandler = (e, id, role) => {
        e.preventDefault()
        let randomNumber = Math.floor(Math.random() * 20) + 1
        randomNumber = randomNumber + (parseInt(npcModifier) || parseInt(playerModifier) || parseInt(newNpcModifier) || 0)
        if (role === 'player') {
            setInitiativeValue(randomNumber)
            setPlayerModifier('')
        } else if (role === 'npc-new') {
            setNpcInitiative(randomNumber)
            setNewNpcModifier('')
        } else if (role === 'npc-edit') {
            setSelectedNPCInitiative(randomNumber)
            setNpcModifer('')
        }
        document.getElementById(id).focus()
    }

    const npcInitiativeModalProps = {
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
    }

    return (
        <div className='initiative-order-container'>
            <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Row>
                    <div className='initiative-order-table-wrapper'>
                        {sortedPlayers.size > 0 &&
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        <strong>{ INITIATIVE_PAGE.character }</strong>
                                    </th>
                                    <th>
                                        <strong>{ INITIATIVE_PAGE.initiative }</strong>
                                    </th>
                                    {(isAdmin || isUserDM) &&
                                    <th>
                                        <strong>{ INITIATIVE_PAGE.edit }</strong>
                                    </th> }
                                </tr>
                                { sortedPlayers?.keySeq().map((player, index) => {
                                    const name = sortedPlayers.getIn([player, 'characterName'])
                                    const initiative = sortedPlayers.getIn([player, 'initiativeValue'])
                                    const isNPC = sortedPlayers.getIn([player, 'NPC'], false)
                                    const isDM = sortedPlayers.getIn([player, 'gameMaster'], false)
                                    if (!isDM) {
                                        return (
                                            <tr key={ index }>
                                                <td>{ name }</td>
                                                <td>{ initiative }</td>
                                                { (isAdmin || isUserDM) &&
                                            <td>
                                                { isNPC &&
                                                <a
                                                    className='initiative-order-edit-button'
                                                    onClick={ () => {
                                                        setShowInitiativeModal(true)
                                                        setSelectedNPCName(name)
                                                    } }
                                                >
                                                    { INITIATIVE_PAGE.edit }
                                                </a> }
                                            </td> }
                                            </tr>
                                        )
                                    }
                                })
                                }
                            </tbody>
                        </table> }
                        { sortedPlayers.size < 1 && showSpinner &&
                        <div style={{ textAlign: 'center' }}>
                            <img src={ spinner } alt='loading' style={{ width: '75%' }} />
                        </div>}
                    </div>
                </Row>
                {!isUserDM &&
                <Row>
                    <div className='initiative-order-initiative-wrapper'>
                        <Form onSubmit={ (e) => initiativeModifierHandler(e, 'player-initiative-submit', 'player') }>
                            <div className='initiative-order-initiative-header'>
                                { INITIATIVE_PAGE.setInitiative }
                            </div>
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
                                            setPlayerModifier(e.target.value)
                                        }
                                    } }
                                    type="tel"
                                    value={ playerModifier }
                                />
                                <Button className="ml-3" onClick={ (e) => initiativeModifierHandler(e, 'player-initiative-submit', 'player') }>
                            Roll Inititiative
                                </Button>
                            </InputGroup>
                        </Form>
                        <Form onSubmit={ (e) => updatePlayersInitiative(e) }>
                            <InputGroup className="mb-3 mt-3">
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
                                            setInitiativeValue(e.target.value)
                                        }
                                    } }
                                    type="tel"
                                    value={ initiativeValue }
                                />
                                <Button className='ml-3' disabled={ !initiativeValue } id='player-initiative-submit' type='submit' onClick={ (e) => updatePlayersInitiative(e) }>
                                    { GENERAL.submit }
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                </Row>
                }
                {(isAdmin || isUserDM) &&
                <>
                    <Row>
                        <div className='initiative-order-initiative-wrapper'>
                            <Form onSubmit={ (e) => addNPC(e) }>
                                <div className='initiative-order-initiative-header'>
                                    { INITIATIVE_PAGE.npcCreator }
                                </div>
                                <Form.Group>
                                    <Form.Label>
                                        { GENERAL.name }
                                    </Form.Label>
                                    <Form.Control type="text" maxLength='20' value={ npcName } onChange={ (e) => setNpcName(e.target.value) } />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        { INITIATIVE_PAGE.initiative }
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                        Modifier
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            className='initiative-order-initiative-modifier'
                                            id='initiative-order-initiative-modifier'
                                            maxLength='2'
                                            placeholder='0'
                                            onChange={ (e) => {
                                                if (numberValidation(e.target.value)) {
                                                    setNewNpcModifier(e.target.value)
                                                }
                                            } }
                                            type="tel"
                                            value={ newNpcModifier }
                                        />
                                        <Button className="ml-3" onClick={ (e) => initiativeModifierHandler(e, 'npc-creator-submit', 'npc-new') }>
                            Roll Inititiative
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                        Initiative
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            maxLength='2'
                                            onChange={ (e) => {
                                                if (numberValidation(e.target.value)) {
                                                    setNpcInitiative(e.target.value)
                                                }
                                            } }
                                            type="tel"
                                            value={ npcInitiative }
                                        />
                                        <Button
                                            className='ml-3'
                                            disabled={ !npcName || !npcInitiative }
                                            id='npc-creator-submit'
                                            onClick={ (e) => addNPC(e) }
                                            type="submit"
                                            variant="primary"
                                        >
                                            { GENERAL.submit }
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <Button
                                    disabled={ !newNpcModifier && !npcInitiative && !npcName }
                                    onClick={ () => {
                                        setNewNpcModifier('')
                                        setNpcInitiative('')
                                        setNpcName('')
                                    } }
                                    style={{ margin: '0 auto' }}
                                    tabIndex='-1'
                                    variant='danger'
                                >
                                    Clear
                                </Button>
                            </Form>
                        </div>
                    </Row>
                    { sortedPlayers.size > 0 &&
                    <>
                        <Row className='mt-3'>
                            <Button
                                disabled={ !sortedPlayers.some(k => k.get('NPC')) }
                                onClick={ () => {
                                    setShowConfirmationModal(true)
                                    setResetInitiativeGroup('npcs')
                                } }
                                style={{ margin: '5px' }}
                                tabIndex='-1'
                            >
                            Remove All NPCs
                            </Button>
                            <Button
                                disabled={ !sortedPlayers.some(k => k.get('player')) }
                                onClick={ () => {
                                    setShowConfirmationModal(true)
                                    setResetInitiativeGroup('players')
                                } }
                                style={{ margin: '5px ' }}
                                tabIndex='-1'
                            >
                            Reset Players Initiatives
                            </Button>
                        </Row>
                        <Row>
                            <Button
                                disabled={ sortedPlayers.isEmpty() }
                                tabIndex='-1'
                                className='ml-3 mr-3 mt-3'
                                onClick={ () => {
                                    setShowConfirmationModal(true)
                                    setResetInitiativeGroup(null)
                                } }
                                variant='danger'
                            >
                                { INITIATIVE_PAGE.resetInitiative }
                            </Button>
                        </Row>
                    </>}
                </>
                }
            </Col>
            <NPCInitiativeModal { ...npcInitiativeModalProps } />
            {/* Confirmation Modal */}
            <Modal
                show={ showConfirmationModal }
                onHide={ () => setShowConfirmationModal(false) }
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                enforceFocus
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {`Reset all ${ resetInitiativeGroup || '' } initiative values?`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Button
                            className='mr-3'
                            onClick={ () => {
                                dispatch(resetInitiative(resetInitiativeGroup))
                                setShowConfirmationModal(false)
                            } }
                        >
                            { INITIATIVE_PAGE.yes }
                        </Button>
                        <Button
                            onClick={ () => {
                                setResetInitiativeGroup(null)
                                setShowConfirmationModal(false)
                            } }
                        >
                            { INITIATIVE_PAGE.nevermind }
                        </Button>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}
