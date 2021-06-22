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
    const [showModal, setShowModal] = useState(false)
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

    const updatePlayersInitiative = (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(initiativeValue || selectedNPCInitiative)
        if (!isNaN(initiativeToNum)) {
            dispatch(updatePlayerInitiative(initiativeToNum, 'players', userData.get('uid')))
            getData()
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
            getData()
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
                                    {/* <th><strong>Whoʼs Turn?</strong></th> */}
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
                                                {/* <td>{ isSelected ? 'X' : '' }</td> */}
                                                { (isAdmin || isUserDM) &&
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
                {/* <Row style={{ placeContent: 'center', margin: '10px' }}>
                    <Button onClick={ () => {console.log('last player')} }>Last Player</Button>
                    <Button className='ml-3 mr-3' onClick={ () => {console.log('next player')} }>Next Player</Button>
                </Row> */}
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
                    <Row>
                        <Button
                            className='ml-3 mr-3 mt-3'
                            onClick={ () => {
                                dispatch(resetInitiative())
                                getData()
                            } }
                            variant='danger'
                        >
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
                            onClick={ () => {
                                dispatch(removeNPC(selectedNPCName))
                                getData()
                                setShowModal(false)
                            } }
                            variant='danger'
                        >
                            {`${ GENERAL.remove } ${ selectedNPCName }`}</Button>
                    </Row>
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
