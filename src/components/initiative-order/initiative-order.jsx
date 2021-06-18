import React, { useState } from 'react'
import Immutable from 'immutable'
import { InputGroup, FormControl, Button, Col, Row, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { db } from '../../database/firebase'
import './initiative-order.css'
import { getActiveGameId, getActiveGameData, getCurrentUser, updatePlayerInitiative, setError, setNPC } from '../../store/store'

export const InitiativeOrder = () => {
    const dispatch = useDispatch()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const gameData = useSelector(getActiveGameData)

    const [initiativeValue, setInitiativeValue] = useState('')
    const [gamePlayers, setGamePlayers] = useState(Immutable.Map())
    const [npcName, setNpcName] = useState('')
    const [npcInitiative, setNpcInitiative] = useState('')

    const isAdmin = userData.get('admin', false)

    const doc = db.collection('games').doc(activeGameId)
    // doc.onSnapshot(snapshot => {
    //     const data = Immutable.fromJS(snapshot.data())
    //     const players = data?.get('players')
    //     const npcs = data?.get('NPCs', undefined)
    //     let tempPlayers = Immutable.Map()
    //     if (players) {
    //         const playerByUID = players.keySeq()
    //         playerByUID.forEach(player => {
    //             const playerName = players.getIn([player, 'characterName'], null)
    //             const playerInitiative = players.getIn([player, 'initiativeValue'], 'Not Set')
    //             const isPlayerSelected = players.getIn([player, 'selected'], false)
    //             if (!tempPlayers.keySeq().includes(playerName)){
    //                 const data = Immutable.Map({ [playerName]: Immutable.Map({ initiative: playerInitiative, selected: isPlayerSelected }) })
    //                 tempPlayers = tempPlayers.merge(data)
    //             }
    //         })
    //     }
    //     if (npcs) {
    //         const npcByName = npcs.keySeq()
    //         npcByName.forEach(npc => {
    //             const npcName = npcs.getIn([npc, 'name'], null)
    //             const npcInitiative = npcs.getIn([npc, 'initiative'], 'Not Set')
    //             const isNpcSelected = npcs.getIn([npc, 'selected'], false)
    //             const isNPC = npcs.getIn([npc, 'NPC'])
    //             if (!tempPlayers.keySeq().includes(npcName)){
    //                 const data = Immutable.Map({ [npcName]: Immutable.Map({ initiative: npcInitiative, selected: isNpcSelected, NPC: isNPC }) })
    //                 tempPlayers = tempPlayers.merge(data)
    //             }
    //         })
    //     }
    //     const sortedPlayers = tempPlayers.toOrderedMap().sortBy(x => -x.get('initiative'))
    //     if (gamePlayers !== sortedPlayers) {
    //         setGamePlayers(sortedPlayers)
    //     }
    // }, e => {
    //     dispatch(setError(`Encountered error: ${ e }`))
    // })

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
            } else if (!gameData.get('NPCs').keySeq().includes(npcName.trim())) {
                dispatch(setError('This NPC is already created. Please use a new NPC name'))
            } else {
                dispatch(setError('Please enter a valid initiative value in numeric format.'))
                setNpcInitiative('')
            }
        }
    }

    const resetInitiative = async () => {
        const getData = await doc.get()
        const data = Immutable.fromJS(getData.data())
        const npcData = data.get('NPCs', undefined)
        const playerData = data.get('players')

        if (npcData && npcData.size > 0) {
            doc.update({ 'NPCs': {} })
        } else {
            const playerKeys = playerData.keySeq()
            playerKeys.forEach(key => {
                const path = `players.${ key }.initiativeValue`
                doc.update({ [path]: null })
            })
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
                                {/* { gameData?.get('NPCs')?.size > 0 && <th><strong>Edit</strong></th> } */}
                            </tr>
                            {gamePlayers.keySeq().map((player, index) => {
                                const initiative = gamePlayers.getIn([player, 'initiative'])
                                const isNPC = gamePlayers.getIn([player, 'NPC'], false)
                                // const isSelected = gamePlayers.getIn([player, 'selected'])
                                return (
                                    <tr key={ index }>
                                        <td>{ player }</td>
                                        <td>{ initiative }</td>
                                        {/* <td>{ isSelected ? 'X' : '' }</td> */}
                                        <td>{ isNPC &&<a href='#'>Edit</a> }</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Row>
                {/* <Row style={{ placeContent: 'center', margin: '10px' }}> */}
                {/* <Button onClick={ () => {console.log('last player')} }>Last Player</Button> */}
                {/* <Button className='ml-3 mr-3' onClick={ () => {console.log('next player')} }>Next Player</Button> */}
                {/* </Row> */}
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
                        <Button className='ml-3 mr-3 mt-3' onClick={ () => resetInitiative() }>Reset Initiative</Button>
                    </Row>
                </>
                }
            </Col>
        </div>
    )
}
