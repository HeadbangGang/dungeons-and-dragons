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
    resetInitiative,
    setConsolidatedPlayers,
    setError,
    setNPC,
    updateNPCInitiative,
    updatePlayerInitiative
} from '../../store/store'
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
    const [showModal, setShowModal] = useState(false)
    const [selectedNPCName, setSelectedNPCName] = useState('')
    const [selectedNPCInitiative, setSelectedNPCInitiative] = useState('')

    const isAdmin = userData.get('admin', false)
    const doc = db.collection('games').doc(activeGameId)

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
            const sortedPlayers = allPlayers.toOrderedMap().sortBy(x => -x.get('initiativeValue'))
            dispatch(setConsolidatedPlayers(sortedPlayers))
        }
        setTimeout(getData, 1000)
    }

    const updatePlayersInitiative = (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(initiativeValue || selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            dispatch(updatePlayerInitiative(initiativeToNum, 'players', userData.get('uid')))
            setInitiativeValue('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setInitiativeValue('')
        }
    }

    const updateNPCsInitiative = (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            setShowModal(false)
            dispatch(updateNPCInitiative(initiativeToNum, selectedNPCName))
            setSelectedNPCInitiative('')
            setSelectedNPCName('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setSelectedNPCInitiative('')
        }
    }

    const addNPC = (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(npcInitiative)
        if (!isNaN(initiativeToNum) && npcName.trim() !== '' && !gameData.get('NPCs')?.keySeq().includes(npcName.trim())) {
            dispatch(setNPC(npcName, initiativeToNum))
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
                                    {/* <th><strong>Whoʼs Turn?</strong></th> */}
                                    { gameData?.get('NPCs')?.size > 0 && isAdmin &&
                                    <th>
                                        <strong>{ INITIATIVE_PAGE.edit }</strong>
                                    </th> }
                                </tr>
                                {allPlayersConsolidated?.keySeq().map((player, index) => {
                                    const name = allPlayersConsolidated.getIn([player, 'characterName'])
                                    const initiative = allPlayersConsolidated.getIn([player, 'initiativeValue'], 'Not Set')
                                    const isNPC = allPlayersConsolidated.getIn([player, 'NPC'], false)
                                    // const isSelected = gamePlayers.getIn([player, 'selected'])
                                    return (
                                        <tr key={ index }>
                                            <td>{ name }</td>
                                            <td>{ initiative === null ? 'Not Set' : initiative }</td>
                                            {/* <td>{ isSelected ? 'X' : '' }</td> */}
                                            { gameData.get('NPCs')?.size > 0 && isAdmin &&
                                            <td>
                                                { isNPC &&
                                                <a
                                                    className='initiative-order-edit-button'
                                                    onClick={ () => {
                                                        setShowModal(true)
                                                        setSelectedNPCName(name)
                                                    } }
                                                >
                                                    { INITIATIVE_PAGE.edit }
                                                </a> }
                                            </td> }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Row>
                <Row className='initiative-order-disclaimer-row'>
                    <div className='initiative-order-disclaimer'>
                        <strong>{ INITIATIVE_PAGE.disclaimer }</strong>
                    </div>
                </Row>
                {/* <Row style={{ placeContent: 'center', margin: '10px' }}>
                    <Button onClick={ () => {console.log('last player')} }>Last Player</Button>
                    <Button className='ml-3 mr-3' onClick={ () => {console.log('next player')} }>Next Player</Button>
                </Row> */}
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
                {isAdmin &&
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
                    <Row>
                        <Button className='ml-3 mr-3 mt-3' onClick={ () => dispatch(resetInitiative()) } variant='danger'>
                            { INITIATIVE_PAGE.resetInitiative }
                        </Button>
                    </Row>
                </>
                }
            </Col>
            <Modal
                show={ showModal }
                onHide={ () => setShowModal(false) }
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                enforceFocus
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {`${ INITIATIVE_PAGE.editInitiativeFor } ${ selectedNPCName }`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={ () => setShowModal(false) }>
                        { GENERAL.close }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
