import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
    getActiveGameId,
    getAllGamePlayers,
    getCurrentUID,
    getCurrentUserIsAdmin,
    getCurrentUserIsDm,
    setErrors,
    updateActiveGameData,
    updateChosenInitiative
} from '../../store'
import { numberValidation } from '../../helpers/helpers'
import I18N, { language } from '../I18N/i18n'
import ConfirmationModal from './confirmation-modal'
import InitiativeRoller from './initiative-roller'
import NPCInitiativeModal from './npc-initiative-modal'
import './initiative-order.scss'

const InitiativeOrder = () => {
    const dispatch = useDispatch()

    const uid = useSelector(getCurrentUID)
    const gameId = useSelector(getActiveGameId)
    const allGamePlayers = useSelector(getAllGamePlayers)
    const isAdmin = useSelector(getCurrentUserIsAdmin)
    const isDM = useSelector(getCurrentUserIsDm)

    const [initiativeValue, setInitiativeValue] = useState('')
    const [npcName, setNpcName] = useState('')
    const [npcInitiative, setNpcInitiative] = useState('')
    const [showInitiativeModal, setShowInitiativeModal] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [resetInitiativeGroup, setResetInitiativeGroup] = useState(null)
    const [selectedNPCName, setSelectedNPCName] = useState('')
    const [selectedNPCInitiative, setSelectedNPCInitiative ] = useState('')
    const [npcModifier, setNpcModifier] = useState('')
    const [playerModifier, setPlayerModifier] = useState('')
    const [newNpcModifier, setNewNpcModifier] = useState('')
    const [sortedPlayers, setSortedPlayers] = useState([])

    useEffect(() => {
        if (Object.keys(allGamePlayers).length > 0) {
            const allPlayersUids = Object.keys(allGamePlayers)
            const gameMasterIndex = allPlayersUids.findIndex(uid => allGamePlayers[uid].gameMaster)
            if (gameMasterIndex > -1) {
                allPlayersUids.splice(gameMasterIndex, 1)
            }

            const filteredPlayers =  allPlayersUids.map(uid => allGamePlayers[uid])
            const sortedPlayers = filteredPlayers.sort((a, b) => {
                if (+a.initiativeValue === +b.initiativeValue) {
                    return a.characterName > b.characterName ? 1 : -1
                }
                return +b.initiativeValue - +a.initiativeValue
            })
            setSortedPlayers(sortedPlayers)
        }
    }, [allGamePlayers])

    const updatePlayersInitiative = async (event) => {
        event.preventDefault()
        const initiativeToNum = +initiativeValue || +selectedNPCInitiative
        if (numberValidation(initiativeToNum)) {
            dispatch(updateChosenInitiative(initiativeToNum, uid))
            setInitiativeValue('')
        } else {
            dispatch(setErrors(language.errors.enterValidInitiativeValue))
            setInitiativeValue('')
        }
    }

    const addNPC = async (event) => {
        event.preventDefault()
        const cleanNpc = npcName.trim()
        const initiativeToNum = +npcInitiative
        if (!isNaN(initiativeToNum) && cleanNpc !== '' && !sortedPlayers?.filter(player => player.characterName === cleanNpc).length) {
            dispatch(updateActiveGameData(gameId, cleanNpc, true, initiativeToNum))
            setNpcName('')
            setNpcInitiative('')
        } else {
            if (cleanNpc === '') {
                dispatch(setErrors(language.errors.enterNPCName))
                setNpcName('')
            }
            if (sortedPlayers?.filter(player => player.characterName === cleanNpc).length) {
                dispatch(setErrors(language.errors.npcExists))
                setNpcName('')
            }
        }
    }

    const resetNPCCreator = () => {
        setNewNpcModifier('')
        setNpcInitiative('')
        setNpcName('')
    }

    const npcInitiativeModalProps = {
        npcModifier,
        numberValidation,
        selectedNPCInitiative,
        selectedNPCName,
        setNpcModifier,
        setSelectedNPCInitiative,
        setSelectedNPCName,
        setShowInitiativeModal,
        showInitiativeModal
    }

    const confirmationModalProps = {
        resetInitiativeGroup,
        setResetInitiativeGroup,
        setShowConfirmationModal,
        showConfirmationModal
    }

    return (
        <div className="initiative-order__container">
            <div className="initiative-order__table">
                { sortedPlayers.length ?
                    <table title="Initiative Order">
                        <thead>
                            <tr>
                                <td colSpan={ isAdmin || isDM ? 3 : 2 }>
                                    <strong><I18N name="initiativeOrder.header" /></strong>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <I18N name="initiativeOrder.character" />
                                </th>
                                <th>
                                    <I18N name="initiativeOrder.initiative" />
                                </th>
                                { (isAdmin || isDM) &&
                                    <th>
                                        <I18N name="initiativeOrder.modify" />
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            { sortedPlayers?.map((player, index) => {
                                const { characterName, initiativeValue, NPC, gameMaster } = player
                                if (!gameMaster) {
                                    return (
                                        <tr key={ index }>
                                            <td><strong>{ characterName }</strong></td>
                                            <td>{ initiativeValue }</td>
                                            { (isAdmin || isDM) &&
                                            <td>
                                                { NPC &&
                                                    <Button
                                                        variant="outline-primary"
                                                        className="initiative-order__modify-button"
                                                        onClick={ () => {
                                                            setShowInitiativeModal(true)
                                                            setSelectedNPCName(characterName)
                                                        } }
                                                    >
                                                        <I18N name="initiativeOrder.modify" />
                                                    </Button> }
                                            </td> }
                                        </tr>
                                    )
                                }
                            })
                            }
                        </tbody>
                    </table>
                    : <div style={{ textAlign: 'center' }}>
                        <img src="/assets/media/spinner.webp" alt="loading" style={{ width: '75%' }} />
                    </div> }
            </div>
            { !isDM &&
                    <div className="initiative-order__wrapper">
                        <InitiativeRoller
                            center
                            infoButton
                            initiativeValue={ initiativeValue }
                            modifierValue={ playerModifier }
                            setInitiativeValue={ setInitiativeValue }
                            setModifierValue={ setPlayerModifier }
                            showHeader
                            submitInitiativeValue={ updatePlayersInitiative }
                        />
                    </div>
            }
            { (isAdmin || isDM) &&
                <>
                    <div className="initiative-order__wrapper">
                        <I18N blockLevel className="initiative-order__header" name="initiativeOrder.npcCreator" />
                        <div className="styled-input__wrapper">
                            <I18N blockLevel className="styled-input__label" name="common.name" />
                            <input type="text" maxLength="20" value={ npcName } onChange={ (e) => setNpcName(e.target.value) } />
                        </div>
                        <InitiativeRoller
                            header={ language.initiativeOrder.initiative }
                            infoButton
                            initiativeValue={ npcInitiative }
                            modifierValue={ newNpcModifier }
                            setInitiativeValue={ setNpcInitiative }
                            setModifierValue={ setNewNpcModifier }
                            showHeader
                            submitInitiativeValue={ addNPC }
                        />
                        <Button
                            disabled={ !newNpcModifier && !npcInitiative && !npcName }
                            onClick={ resetNPCCreator }
                            tabIndex="-1"
                            variant="danger"
                        >
                            <I18N name="common.clear" />
                        </Button>
                    </div>
                    { sortedPlayers.length &&
                    <div className="initiative-order__reset-buttons">
                        <Button
                            disabled={ !sortedPlayers.some(player => player.NPC) }
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup('NPCs')
                            } }
                            tabIndex="-1"
                        >
                            <I18N name="initiativeOrder.removeAllNPCs" />
                        </Button>
                        <Button
                            disabled={ !sortedPlayers.some(player => player.initiativeValue && !player.NPC) }
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup('players')
                            } }
                            tabIndex="-1"
                        >
                            <I18N name="initiativeOrder.resetAllPlayers" />
                        </Button>
                        <Button
                            disabled={ !sortedPlayers.length || !sortedPlayers.some(player => player.initiativeValue) }
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup(null)
                            } }
                            tabIndex="-1"
                            variant="danger"
                        >
                            <I18N name="initiativeOrder.resetInitiative" />
                        </Button>
                    </div> }
                </>
            }
            <NPCInitiativeModal { ...npcInitiativeModalProps } />
            <ConfirmationModal { ...confirmationModalProps } />
        </div>
    )
}

export default InitiativeOrder
