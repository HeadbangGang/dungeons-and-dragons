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
} from '../../store/store'
import { numberValidation } from '../../helpers/helpers'
import ConfirmationModal from './confirmation-modal'
import InitiativeRoller from './initiative-roller'
import NPCInitiativeModal from './npc-initiative-modal'
import { GENERAL, INITIATIVE_PAGE } from '../../helpers/language-map'

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
        if (!isNaN(initiativeToNum)) {
            dispatch(updateChosenInitiative(initiativeToNum, uid))
            setInitiativeValue('')
        } else {
            dispatch(setErrors('Please enter a valid initiative value in numeric format.'))
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
                dispatch(setErrors('Please enter a valid NPC name.'))
                setNpcName('')
            }
            if (sortedPlayers?.filter(player => player.characterName === cleanNpc).length) {
                dispatch(setErrors('This character already exists. Please use a different NPC name.'))
                setNpcName('')
            }
        }
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
                                <td colSpan="3">
                                    <strong>Initiative Order</strong>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <strong>{ INITIATIVE_PAGE.character }</strong>
                                </th>
                                <th>
                                    <strong>{ INITIATIVE_PAGE.initiative }</strong>
                                </th>
                                { (isAdmin || isDM) &&
                                    <th>
                                        <strong>{ INITIATIVE_PAGE.modify }</strong>
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
                                                        { INITIATIVE_PAGE.modify }
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
                        <img src="media/spinner.webp" alt="loading" style={{ width: '75%' }} />
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
                        <div className="initiative-order__header">
                            { INITIATIVE_PAGE.npcCreator }
                        </div>
                        <div className="styled-input__wrapper">
                            <div className="styled-input__label">
                                { GENERAL.name }
                            </div>
                            <input type="text" maxLength="20" value={ npcName } onChange={ (e) => setNpcName(e.target.value) } />
                        </div>
                        <InitiativeRoller
                            header="Initiative"
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
                            onClick={ () => {
                                setNewNpcModifier('')
                                setNpcInitiative('')
                                setNpcName('')
                            } }
                            style={{ margin: '0 auto' }}
                            tabIndex="-1"
                            variant="danger"
                        >
                            Clear
                        </Button>
                    </div>
                    { sortedPlayers.length &&
                    <>
                        <Button
                            disabled={ !sortedPlayers.some(player => player.NPC) }
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup('npcs')
                            } }
                            style={{ margin: '5px' }}
                            tabIndex="-1"
                        >
                            Remove All NPCs
                        </Button>
                        <Button
                            disabled={ !sortedPlayers.some(player => player.initiativeValue && !player.NPC) }
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup('players')
                            } }
                            style={{ margin: '5px ' }}
                            tabIndex="-1"
                        >
                            Reset Players Initiatives
                        </Button>
                        <Button
                            disabled={ !sortedPlayers.length || !sortedPlayers.some(player => player.initiativeValue) }
                            tabIndex="-1"
                            onClick={ () => {
                                setShowConfirmationModal(true)
                                setResetInitiativeGroup(null)
                            } }
                            variant="danger"
                        >
                            { INITIATIVE_PAGE.resetInitiative }
                        </Button>
                    </> }
                </>
            }
            <NPCInitiativeModal { ...npcInitiativeModalProps } />
            <ConfirmationModal { ...confirmationModalProps } />
        </div>
    )
}

export default InitiativeOrder
