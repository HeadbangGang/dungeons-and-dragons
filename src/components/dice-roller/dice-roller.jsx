import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDiceValues, resetDiceValues, updateDiceValues } from '../../store/store'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { DEFAULT_DICE_SIDES } from '../../helpers/constants'
import { numberValidation } from '../../helpers/helpers'
import './dice-roller.scss'

const DiceRoller = () => {
    const dispatch = useDispatch()

    const [totalRollValue, setTotalRollValue] = useState('')
    const [diceQuantities, setDiceQuantities] = useState([])

    const diceValues = useSelector(getDiceValues)

    useEffect(() => {
        let total = 0
        DEFAULT_DICE_SIDES.forEach(die => {
            total = calculateTotalValue(diceValues[die], total)
        })
        setTotalRollValue(total)
        setDiceQuantities([])
    }, [diceValues])

    const calculateTotalValue = (diceArr, totalVal) => {
        let total = totalVal ?? 0
        diceArr.forEach(die => {
            total = total + die
        })
        return total
    }

    const handleDiceQuantities = (die, quantity) => {
        const index = diceQuantities.findIndex(k => k[die])
        if (numberValidation(quantity) && quantity !== '0') {
            if (index > -1) {
                const copyOfQuantities = [...diceQuantities]
                if (!quantity) {
                    const dieIndex = diceQuantities.findIndex(item => Object.keys(item)[0] === die)
                    copyOfQuantities.splice(dieIndex, 1)
                } else {
                    copyOfQuantities[index][die] = quantity
                }
                setDiceQuantities(copyOfQuantities)
            } else {
                setDiceQuantities([...diceQuantities, { [die]: quantity }])
            }
        }
    }

    const roll = () => {
        diceQuantities.forEach(dice => {
            const nums = []
            const dieValue = Object.keys(dice)[0]
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

    const valueClassName = (value) => {
        if (value === 20) return 'success'
        if (value === 1) return 'failure'
        return 'neutral'
    }

    const disableRollButton = () => {
        let shouldDisable
        shouldDisable = diceQuantities.length < 1
        diceQuantities.forEach(item => {
            const itemValue = item[Object.keys(item)[0]]
            shouldDisable = itemValue < 1
        })
        return shouldDisable
    }

    return (
        <div className="dice-roller">
            <h1>Dice Roller</h1>
            { totalRollValue > 0 &&
                <h2>
                    Total value:
                    <div><strong>{ totalRollValue }</strong></div>
                </h2> }
            <form onSubmit={ (e) => {
                e.preventDefault()
                roll()
            } }
            >
                <div className="dice-roller__dice-inputs">
                    { DEFAULT_DICE_SIDES.map(dice => {
                        const index = diceQuantities.findIndex(die => die[dice])
                        return (
                            <InputGroup key={ dice }>
                                <InputGroup.Text>{ dice }</InputGroup.Text>
                                <FormControl
                                    id={ dice }
                                    inputMode="numeric"
                                    maxLength="2"
                                    onChange={ e => {
                                        const { value, maxLength } = e.target
                                        value.length > maxLength
                                            ? value.slice(0, maxLength)
                                            : handleDiceQuantities(dice, value)
                                    } }
                                    pattern="[0-9]*"
                                    placeholder={ `Quantity of ${ dice }'s` }
                                    type="number"
                                    value={ (diceQuantities.length > 0 && index > -1 && diceQuantities[index] && diceQuantities[index][dice]) || '' }
                                />
                            </InputGroup>
                        )
                    }) }
                </div>
                <div className="dice-roller__button-wrapper">
                    <Button
                        disabled={ disableRollButton() }
                        onClick={ roll }
                        type="submit"
                    >
                        Roll
                    </Button>
                    <Button
                        disabled={ !totalRollValue }
                        onClick={ resetTable }
                        tabIndex="-1"
                        variant="danger"
                    >
                        Reset Table
                    </Button>
                </div>
            </form>
            <div>
                { totalRollValue > 0 &&
                <table>
                    <tbody>
                        <tr>
                            { DEFAULT_DICE_SIDES.map(die => (
                                <th key={ die }>
                                    <strong>{ `${ die }'s` }</strong>
                                </th>
                            )) }
                        </tr>
                        <tr>
                            { DEFAULT_DICE_SIDES.map((die) => (
                                <th key={ die }>
                                    <div>
                                        <em>{ calculateTotalValue(diceValues[die]) }</em>
                                    </div>
                                </th>
                            )) }
                        </tr>
                        <tr>
                            { Object.keys(diceValues).map((value, index) => (
                                <td key={ index }>
                                    { diceValues[value].map((die, idx) => (
                                        <div className={ valueClassName(die) } key={ idx } >
                                            <em>{ die }</em>
                                            { idx + 1 !== diceValues[value].length && <hr /> }
                                        </div>
                                    )) }
                                </td>
                            )) }
                        </tr>
                    </tbody>
                </table> }
            </div>
        </div>
    )
}

export default DiceRoller
