import React, { useEffect, useState } from 'react'
import Immutable from 'immutable'
import { InputGroup, FormControl, Button, Col, Row, Form, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { db } from '../../database/firebase'
import './initiative-order.css'
import {
    getActiveGameData,
    getActiveGameId,
    getConsolidatedPlayers,
    getCurrentUser,
    removeNPC,
    resetInitiative,
    setConsolidatedPlayers,
    setError,
    setNPC,
    updateNPCInitiative,
    updatePlayerInitiative
} from '../../store/store'
import spinner from '../../media/spinner.webp'
import { GENERAL, INITIATIVE_PAGE } from '../../language-map'

export const InitiativeOrder = () => {
    const dispatch = useDispatch()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const gameData = useSelector(getActiveGameData)
    const allPlayersConsolidated = useSelector(getConsolidatedPlayers)

    const [initiativeValue, setInitiativeValue] = useState('')
    const [npcName, setNpcName] = useState('')
    const [npcInitiative, setNpcInitiative] = useState('')
    const [showInitiativeModal, setShowInitiativeModal] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [resetInitiativeGroup, setResetInitiativeGroup] = useState(null)
    const [selectedNPCName, setSelectedNPCName] = useState('')
    const [selectedNPCInitiative, setSelectedNPCInitiative] = useState('')

    const isAdmin = userData.get('admin', false)
    const currentUid = userData.get('uid')
    const isUserDM = gameData.getIn(['players', currentUid, 'gameMaster'])
    const doc = db.collection('games').doc(activeGameId)

    useEffect(() => {
        const timeout = setTimeout(getData, 5000)
        return () => clearTimeout(timeout)
    })

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const fetchDoc = await doc.get()
        const data = Immutable.fromJS(fetchDoc.data())
        if (data) {
            const players = data.get('players')
            const npcs = data.get('NPCs')
            const allPlayers = players.merge(npcs)
            const sortedPlayers = allPlayers.toOrderedMap().sortBy(x => {
                if (x.get('initiativeValue') > -100 && !x.get('gameMaster')){
                    return -x.get('initiativeValue')
                }
            })
            dispatch(setConsolidatedPlayers(sortedPlayers))
        }
    }

    const updatePlayersInitiative = async (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(initiativeValue || selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            await getData()
            await dispatch(updatePlayerInitiative(initiativeToNum, 'players', userData.get('uid')))
            getData()
            setInitiativeValue('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setInitiativeValue('')
        }
    }

    const updateNPCsInitiative = async (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            setShowInitiativeModal(false)
            await getData()
            await dispatch(updateNPCInitiative(initiativeToNum, selectedNPCName))
            getData()
            setSelectedNPCInitiative('')
            setSelectedNPCName('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setSelectedNPCInitiative('')
        }
    }

    const addNPC = async (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(npcInitiative)
        if (!isNaN(initiativeToNum) && npcName.trim() !== '' && !gameData.get('NPCs')?.keySeq().includes(npcName.trim())) {
            await getData()
            await dispatch(setNPC(npcName, initiativeToNum))
            getData()
            setNpcName('')
            setNpcInitiative('')
        } else {
            if (npcName.trim() === '') {
                dispatch(setError('Please enter a valid NPC name'))
                setNpcName('')
            } else if (gameData.get('NPCs').keySeq().includes(npcName.trim())) {
                dispatch(setError('This NPC is already created. Please use a new NPC name'))
            } else {
                dispatch(setError('Please enter a valid initiative value in numeric format.'))
                setNpcInitiative('')
            }
        }
    }

    return (
        <div className='initiative-order-container'>
            <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Row>
                    <div className='initiative-order-table-wrapper'>
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
                                { allPlayersConsolidated?.keySeq().map((player, index) => {
                                    const name = allPlayersConsolidated.getIn([player, 'characterName'])
                                    const initiative = allPlayersConsolidated.getIn([player, 'initiativeValue'], 'Not Set')
                                    const isNPC = allPlayersConsolidated.getIn([player, 'NPC'], false)
                                    const isDM = allPlayersConsolidated.getIn([player, 'gameMaster'], false)
                                    // const isSelected = gamePlayers.getIn([player, 'selected'])
                                    if (!isDM) {
                                        return (
                                            <tr key={ index }>
                                                <td>{ name }</td>
                                                <td>{ initiative === null ? 'Not Set' : initiative }</td>
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
                        </table>
                        { allPlayersConsolidated.size < 1 &&
                        <div style={{ textAlign: 'center' }}>
                            <img src={ spinner } alt='loading' style={{ width: '75%' }} />
                        </div>}
                    </div>
                </Row>
                {!isUserDM &&
                <Row>
                    <div className='initiative-order-initiative-wrapper'>
                        <Form onSubmit={ (e) => updatePlayersInitiative(e) }>
                            <div className='initiative-order-initiative-header'>
                                { INITIATIVE_PAGE.setInitiative }
                            </div>
                            <InputGroup className="mb-3 mt-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        { INITIATIVE_PAGE.initiative }
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    className='initiative-order-initiative-input'
                                    maxLength='2'
                                    onChange={ (e) => setInitiativeValue(e.target.value) }
                                    type="tel"
                                    value={ initiativeValue }
                                />
                                <Button className='ml-3' type='submit' onClick={ (e) => updatePlayersInitiative(e) }>
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
                                    <Form.Control type="tel" maxLength='2' value={ npcInitiative } onChange={ (e) => setNpcInitiative(e.target.value) } />
                                </Form.Group>
                                <Button onClick={ (e) => addNPC(e) } variant="primary" type="submit">Submit</Button>
                            </Form>
                        </div>
                    </Row>
                    <Row className='mt-3'>
                        <Button
                            className='mr-3'
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup('npcs')
                            } }
                            tabIndex='-1'
                        >
                            Remove All NPCs
                        </Button>
                        <Button
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup('players')
                            } }
                            tabIndex='-1'
                        >
                            Reset Players Initiatives
                        </Button>
                    </Row>
                    <Row>
                        <Button
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
                </>
                }
            </Col>
            {/* NPC Initiative Modal */}
            <Modal
                show={ showInitiativeModal }
                onHide={ () => setShowInitiativeModal(false) }
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                enforceFocus
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {`${ INITIATIVE_PAGE.edit } ${ selectedNPCName }`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Form onSubmit={ (e) => updateNPCsInitiative(e) }>
                            <InputGroup className="mb-3 mt-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        { INITIATIVE_PAGE.initiative }
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    className='initiative-order-initiative-input'
                                    maxLength='2'
                                    onChange={ (e) => setSelectedNPCInitiative(e.target.value) }
                                    type="tel"
                                    value={ selectedNPCInitiative }
                                />
                                <Button className='ml-3' type='submit' onClick={ (e) => updateNPCsInitiative(e) }>
                                    { GENERAL.submit }
                                </Button>
                            </InputGroup>
                        </Form>
                    </Row>
                    <Row>
                        <Button
                            onClick={ async () => {
                                await getData()
                                await dispatch(removeNPC(selectedNPCName))
                                getData()
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
                                getData()
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
