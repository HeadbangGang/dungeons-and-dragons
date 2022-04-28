import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { numberValidation } from '../../helpers/helpers'
import { GENERAL, INITIATIVE_PAGE } from '../../helpers/language-map'
import { getIsSmallView } from '../../store'

const InitiativeRoller = (props) => {
    const { center, header, modifierValue, setModifierValue, infoButton, initiativeValue, setInitiativeValue, showHeader, submitInitiativeValue } = props

    const isSmallView = useSelector(getIsSmallView)

    const initiativeModifierHandler = () => {
        const randomNumber = (Math.floor(Math.random() * 20) + 1) + +modifierValue
        setInitiativeValue(randomNumber)
        setModifierValue('')
    }



    return (
        <div className="initiative-roller__container">
            { infoButton &&
                <OverlayTrigger
                    overlay={
                        <Tooltip>
                            <pre className="initiative-roller__info-button__tooltip">
                                <strong>Modifier</strong> + <strong>Initiative</strong> = <strong>Final Initiative Value</strong>
                            </pre>
                        </Tooltip>
                    }
                    placement="top"
                >
                    <span className="material-icons initiative-roller__info-button">info</span>
                </OverlayTrigger> }
            { showHeader && <div className={ `initiative-roller__header ${center ? 'centered' : ''}` }>{ header }</div> }
            <Form onSubmit={ initiativeModifierHandler }>
                <div className="styled-input__wrapper">
                    <div className="styled-input__label">
                    Modifier
                    </div>
                    <input
                        maxLength="2"
                        placeholder="0"
                        onChange={ (e) => {
                            if (numberValidation(e.target.value)) {
                                setModifierValue(e.target.value)
                            }
                        } }
                        type="tel"
                        value={ modifierValue }
                    />
                    <Button onClick={ initiativeModifierHandler }>
                        { `Roll${isSmallView ? '': ' Initiative'}` }
                    </Button>
                </div>
            </Form>
            <Form onSubmit={ setInitiativeValue }>
                <div className="styled-input__wrapper">
                    <div className="styled-input__label">
                        { INITIATIVE_PAGE.initiative }
                    </div>
                    <input
                        maxLength="2"
                        onChange={ (e) => {
                            if (numberValidation(e.target.value)) {
                                setInitiativeValue(e.target.value)
                            }
                        } }
                        type="tel"
                        value={ initiativeValue }
                    />
                    <Button disabled={ !initiativeValue } id="player-initiative-submit" type="submit" onClick={ submitInitiativeValue }>
                        { GENERAL.submit }
                    </Button>
                </div>
            </Form>
        </div>
    )
}

InitiativeRoller.propTypes = {
    center: PropTypes.bool,
    header: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    infoButton: PropTypes.bool,
    initiativeValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    modifierValue: PropTypes.string,
    setInitiativeValue: PropTypes.func,
    setModifierValue: PropTypes.func,
    showHeader: PropTypes.bool,
    submitInitiativeValue: PropTypes.func
}

InitiativeRoller.defaultProps = {
    center: false,
    infoButton: false,
    showHeader: false,
    header: INITIATIVE_PAGE.setInitiative
}

export default InitiativeRoller
