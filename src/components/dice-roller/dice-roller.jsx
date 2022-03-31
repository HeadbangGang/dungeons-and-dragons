import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDiceValues, resetDiceValues, updateDiceValues } from '../../store/store'
import { Button, FormControl, InputGroup, Row } from 'react-bootstrap'
import { DEFAULT_DICE_SIDES } from '../../helpers/constants'

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

    const numberValidation = (die, val) => {
        let valid = true
        if(val && !/^[0-9]+$/.test(val)){
            valid = false
            document.getElementById(die).value = ''
        }
        return valid
    }

    const handleDiceQuantities = (die, quantity) => {
        const index = diceQuantities.findIndex(k => k[die])
        if (numberValidation(die, quantity)) {
            if (index > -1) {
                const copyOfQuantities = [...diceQuantities]
                copyOfQuantities[index][die] = quantity
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
                <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    { DEFAULT_DICE_SIDES.map(dice => {
                        const index = diceQuantities.findIndex(die => die[dice])
                        return (
                            <div key={ dice }>
                                <InputGroup style={{ width: '225px', margin: '5px' }}>
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
                            </div>
                        )
                    }) }
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        disabled={ diceQuantities.length < 1 }
                        onClick={ roll }
                        style={{ margin: '5px' }}
                        type="submit"
                    >
                        Roll
                    </Button>
                    <Button
                        disabled={ !totalRollValue }
                        onClick={ resetTable }
                        style={{ margin: '5px' }}
                        tabIndex="-1"
                        variant="danger"
                    >
                        Reset Table
                    </Button>
                </div>
            </form>
            <div>
                { totalRollValue > 0 &&
                <table style={{ width: '100%', marginTop: '16px' }}>
                    <tbody>
                        <tr>
                            { DEFAULT_DICE_SIDES.map(die => (
                                <th key={ die } style={{ width: '50px' }}>
                                    <strong>{ `${ die }'s` }</strong>
                                </th>
                            )) }
                        </tr>
                        <tr>
                            { DEFAULT_DICE_SIDES.map((die) => (
                                <th key={ die } style={{ width: '50px', padding: '0' }}>
                                    <div>
                                        <em>{ calculateTotalValue(diceValues[die]) }</em>
                                    </div>
                                </th>
                            )) }
                        </tr>
                        <tr>
                            { Object.keys(diceValues).map((value, index) => (
                                <td key={ index } style={{ verticalAlign: 'top' }}>
                                    { diceValues[value].map((die, idx) => (
                                        // eslint-disable-next-line no-nested-ternary
                                        <div key={ idx } style={ die === 20 ? { color: 'green', fontWeight: '600' } : die === 1 ? { color: 'red', fontWeight: '600' } : { color: 'blue' } }>
                                            <em>{ die }</em>
                                            { idx + 1 !== diceValues[value].length && <hr style={{ margin: '0', color: 'black' }} /> }
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
