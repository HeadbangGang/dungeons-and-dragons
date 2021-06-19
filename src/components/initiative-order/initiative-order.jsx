import React, { useEffect, useState } from 'react'
import Immutable from 'immutable'
import { InputGroup, FormControl, Button, Col, Row, Form } from 'react-bootstrap'
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
    updatePlayerInitiative
} from '../../store/store'

export const InitiativeOrder = () => {
    const dispatch = useDispatch()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const gameData = useSelector(getActiveGameData)
    const allPlayersConsolidated = useSelector(getConsolidatedPlayers)

    const [initiativeValue, setInitiativeValue] = useState('')
    const [npcName, setNpcName] = useState('')
    const [npcInitiative, setNpcInitiative] = useState('')

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
        setTimeout(getData, 10000)
    }

    const updateInitiative = async (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(initiativeValue)
        if (!isNaN(initiativeToNum)) {
            dispatch(updatePlayerInitiative(initiativeToNum, 'players', userData.get('uid')))
            setInitiativeValue('')
        } else {
            dispatch(setError('Please enter a valid initiative value in numeric format.'))
            setInitiativeValue('')
        }
    }

    const addNPC = (e) => {
        e.preventDefault()
        const initiativeToNum = parseInt(npcInitiative)
        if (!isNaN(initiativeToNum) && npcName.trim() !== '' && !gameData.get('NPCs').keySeq().includes(npcName.trim())) {
            dispatch(setNPC(npcName, initiativeToNum))
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
        <div style={{ margin: '25px' }}>
            <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Row style={{ placeContent: 'center' }}>
                    <table>
                        <tbody>
                            <tr>
                                <th><strong>Character</strong></th>
                                <th><strong>Initiative</strong></th>
                                {/* <th><strong>Whoʼs Turn?</strong></th> */}
                                { gameData?.get('NPCs')?.size > 0 && <th><strong>Edit</strong></th> }
                            </tr>
                            {allPlayersConsolidated?.keySeq().map((player, index) => {
                                const name = allPlayersConsolidated.getIn([player, 'characterName'])
                                const initiative = allPlayersConsolidated.getIn([player, 'initiativeValue'], 'Not Set')
                                const isNPC = allPlayersConsolidated.getIn([player, 'NPC'], false)
                                // const isSelected = gamePlayers.getIn([player, 'selected'])
                                return (
                                    <tr key={ index }>
                                        <td>{ name }</td>
                                        <td>{ initiative }</td>
                                        {/* <td>{ isSelected ? 'X' : '' }</td> */}
                                        { gameData.get('NPCs').size > 0 && <td>{ isNPC && <a href='#'>Edit</a> }</td> }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Row>
                {/* <Row style={{ placeContent: 'center', margin: '10px' }}>
                    <Button onClick={ () => {console.log('last player')} }>Last Player</Button>
                    <Button className='ml-3 mr-3' onClick={ () => {console.log('next player')} }>Next Player</Button>
                </Row> */}
                <Row style={{ placeContent: 'center' }}>
                    <div style={{ marginTop: '25px', border: '1px solid black', padding: '10px' }}>
                        <Form onSubmit={ (e) => updateInitiative(e) }>
                            <div style={{ textAlign: 'center' }}> Set Your Initiative </div>
                            <InputGroup className="mb-3 mt-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Initiative</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    type="tel"
                                    onChange={ (e) => setInitiativeValue(e.target.value) }
                                    value={ initiativeValue }
                                    maxLength='2'
                                    style={{ width: '50px' }}
                                />
                                <Button className='ml-3' type='submit' onClick={ (e) => updateInitiative(e) }>Submit</Button>
                            </InputGroup>
                        </Form>
                    </div>
                </Row>
                {isAdmin &&
                <>
                    <Row style={{ placeContent: 'center' }}>
                        <div style={{ marginTop: '25px', border: '1px solid black', padding: '10px' }}>
                            <Form onSubmit={ (e) => addNPC(e) }>
                                <div style={{ textAlign: 'center' }}>NPC Creator</div>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" maxLength='20' value={ npcName } onChange={ (e) => setNpcName(e.target.value) } />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Initiative</Form.Label>
                                    <Form.Control type="tel" maxLength='2' value={ npcInitiative } onChange={ (e) => setNpcInitiative(e.target.value) } />
                                </Form.Group>
                                <Button onClick={ (e) => addNPC(e) } variant="primary" type="submit">Submit</Button>
                            </Form>
                        </div>
                    </Row>
                    <Row style={{ placeContent: 'center', margin: '10px' }}>
                        <Button className='ml-3 mr-3 mt-3' onClick={ () => dispatch(resetInitiative()) }>
                            Reset Initiative
                        </Button>
                    </Row>
                </>
                }
            </Col>
        </div>
    )
}
