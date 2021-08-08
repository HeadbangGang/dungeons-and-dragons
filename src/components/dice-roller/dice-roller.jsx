/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDiceValues, getDiceValues, resetDiceValues } from '../../store/store'
import { Row, Button, InputGroup, FormControl } from 'react-bootstrap'

export default function DiceRoller () {
    const dispatch = useDispatch()
    const diceSides = [4, 6, 8, 10, 12, 20]

    const [totalRollValue, setTotalRollValue] = useState()
    const [diceQuantities, setDiceQuantities] = useState([])

    const diceValues = useSelector(getDiceValues)

    useEffect(() => {
        let total = 0
        diceSides.forEach(die => {
            const stringDie = die.toString()
            diceValues.get(stringDie) && diceValues.get(stringDie).forEach(val => {
                total = total + val
            })
        })
        setTotalRollValue(total)
        setDiceQuantities([])
    }, [diceValues])

    const numberValidation = (die, val) => {
        let valid
        if(!/^[0-9]+$/.test(val)){
            valid = false
            document.getElementById(die).value = ''
        } else {
            valid = true
        }
        return valid
    }

    const handleDiceQuantities = (die, quantity) => {
        const index = diceQuantities.findIndex(k => k[die])
        if (numberValidation(die, quantity)) {
            if (index > -1) {
                let copyOfQuantities = [...diceQuantities]
                copyOfQuantities[index][die] = quantity
                setDiceQuantities(copyOfQuantities)
            } else {
                setDiceQuantities([...diceQuantities, { [die]: quantity }])
            }
        }
    }

    const roll = () => {
        diceQuantities.forEach(dice => {
            let nums = []
            const dieValue = Object.keys(dice)
            const dieQuantity = dice[dieValue]

            for (let i = 0; i < dieQuantity; i++) {
                const randomNumber = Math.floor(Math.random() * dieValue) + 1
                nums.push(randomNumber)
            }

            dispatch(updateDiceValues(dieValue, nums))
        })
    }

    const resetTable = () => {
        dispatch(resetDiceValues())
    }

    return (
        <div style={{ padding: '10px' }}>
            <h1 style={{ textAlign: 'center' }}>Dice Roller</h1>
            { totalRollValue > 0 &&
            <Row>
                <h2 style={{ textAlign: 'center', margin: '15px 0' }}>
                    Total value:
                    <div><strong>{ totalRollValue }</strong></div>
                </h2>
            </Row> }
            <form onSubmit={ (e) => {
                e.preventDefault()
                roll()
            } }
            >
                <Row>
                    { diceSides.map(dice => {
                        const index = diceQuantities.findIndex(die => die[dice])
                        return (
                            <div key={ dice }>
                                <InputGroup style={{ width: '225px', margin: '5px' }}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>{ dice }</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder={ `Quantity of ${ dice }'s` }
                                        id={ dice }
                                        maxLength='2'
                                        onChange={ e => {
                                            handleDiceQuantities(dice, e.target.value)
                                        } }
                                        value={ (diceQuantities.length > 0 && index > -1 && diceQuantities[index] && diceQuantities[index][dice]) || '' }
                                    />
                                </InputGroup>
                            </div>
                        )
                    })}
                </Row>
                <Row>
                    <Button style={{ margin: '5px' }} type='submit' disabled={ diceQuantities.length < 1 } onClick={ roll } >Roll</Button>
                    <Button tabIndex='-1' style={{ margin: '5px' }} disabled={ !totalRollValue } onClick={ resetTable } variant='danger'>Reset Table</Button>
                </Row>
            </form>
            <Row>
                { totalRollValue > 0 &&
                <table style={{ width: '65%', marginTop: '16px' }}>
                    <tbody>
                        <tr>
                            <th colSpan='6' style={{ fontSize: 'x-large' }}>
                                <strong>Dice Rolls</strong>
                            </th>
                        </tr>
                        <tr>
                            { diceSides.map((dice, index) => {
                                return (
                                    <th key={ index } style={{ width: '50px' }}>
                                        <strong>{ `${ dice }'s` }</strong>
                                    </th>
                                )
                            })}
                        </tr>
                        <tr>
                            { diceSides.map((dice, index) => {
                                return (
                                    <th key={ index } style={{ width: '50px', padding: '0' }}>
                                        <div>
                                            <em>{ diceValues.get(dice.toString()) && diceValues.get(dice.toString()).reduce((a, b) => { return a + b }) } </em>
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                        <tr>
                            { diceValues.keySeq().map((state, index) => {
                                return (
                                    <td key={ index } style={{ verticalAlign: 'top' }}>
                                        { diceValues.get(state).map((die, index) => {
                                            return (
                                                <div key={ index } style={ die === 20 ? { backgroundColor: 'green' } : die === 1 ? { backgroundColor: 'red' } : { color: 'blue' } }>
                                                    <em>{ die }</em>
                                                    { diceValues.get(state).size > 1 && index !== diceValues.get(state).size - 1 && <hr style={{ margin: '0' }} /> }
                                                </div>
                                            )
                                        })}
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table> }
            </Row>
        </div>
    )
}