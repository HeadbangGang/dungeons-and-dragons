import React, { useContext } from 'react'
import { auth, administrator } from '../../database/firebase'
import { UserContext } from '../../providers/userprovider'
import { useHistory } from 'react-router-dom'
import { AUTHENTICATION, GENERAL } from '../../language-map'


export default function ProfilePage () {
    const userContext = useContext(UserContext ?? '')
    const history = useHistory()

    return (
        <>
            { userContext?.email && userContext?.characterName
                ? <div>
                    <h2>{ userContext.characterName }</h2>
                    <h3>{ userContext.email }</h3>
                    <button onClick={ async () => {
                        try {
                            await auth.signOut()
                                .then(history.push('/'))
                        } catch (e) {
                            console.log(e)
                        }
                    } }
                    >
                        { AUTHENTICATION.signOut }
                    </button>
                </div>
                : <div>{ GENERAL.loading }</div>
            }
        </>
    )

}