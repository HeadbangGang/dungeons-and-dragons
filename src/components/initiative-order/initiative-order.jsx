import React, { useEffect, useState } from 'react'
import Immutable from 'immutable'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { db } from '../../database/firebase'
import './initiative-order.css'
import { getActiveGameId } from '../../store/store'

export const InitiativeOrder = ({ setError }) => {

    const activeGameId = useSelector(getActiveGameId)

    const [initiativeValue, setInitiativeValue] = useState('')
    const [gamePlayers, setGamePlayers] = useState(Immutable.Map())

    useEffect(() => {},[gamePlayers])

    const doc = db.collection('games').doc(activeGameId)
    doc.onSnapshot(snapshot => {
        const data = Immutable.fromJS(snapshot.data())
        const players = data?.get('players')
        if (players) {
            const playerbyUID = players.keySeq()
            playerbyUID.forEach(player => {
                const playerName = players.getIn([player, 'characterName'], null)
                const playerInitiative = players.getIn([player, 'initiativeValue'], 'Not Set')
                const isPlayerSelected = players.getIn([player, 'selected'], false)
                if (!gamePlayers.keySeq().includes(playerName)){
                    const data = Immutable.Map({ [playerName]: Immutable.Map({ initiative: playerInitiative, selected: isPlayerSelected }) })
                    const newData = gamePlayers.merge(data)
                    setGamePlayers(newData)
                }
            })
        }
    }, e => {
        setError(`Encountered error: ${ e }`)
    })

    const sortedPlayers = gamePlayers.toOrderedMap().sortBy(x => -x.get('initiative'))
    return (
        <div style={{ margin: '25px' }}>
            <table>
                <th><strong>Character</strong></th>
                <th><strong>Initiative</strong></th>
                <th><strong>Selected</strong></th>
                {sortedPlayers.keySeq().map((player, index) => {
                    const initiative = gamePlayers.getIn([player, 'initiative'])
                    const isSelected = gamePlayers.getIn([player, 'selected'])
                    return (
                        <tr key={ index }>
                            <td>{ player }</td>
                            <td>{ initiative }</td>
                            <td>{ isSelected ? 'X' : '' }</td>
                        </tr>
                    )
                })}
            </table>
            <button onClick={ () => setInitiativeValue(Math.floor(Math.random() * 20) + 1) }>Random Number</button>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Set Initiative</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type="tel"
                    onChange={ (e) => setInitiativeValue(e.target.value) }
                    value={ initiativeValue }
                    maxLength='2'
                />
            </InputGroup>
            <Button onClick={ () => {
                const initiativeToNum = parseInt(initiativeValue)
                if (!isNaN(initiativeToNum)) {
                    console.log(parseInt(initiativeValue))
                } else {
                    setError('Please submit a valid initiative value in numeric format.')
                    setInitiativeValue('')
                }
            } }
            >
                Submit
            </Button>
        </div>
    )
}

InitiativeOrder.propTypes={
    setError: PropTypes.func
}