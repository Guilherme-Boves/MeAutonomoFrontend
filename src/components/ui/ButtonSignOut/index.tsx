import { useContext } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../../contexts/AuthContext'

export function ButtonSignOut(){

    const { signOut } = useContext(AuthContext)

    return(
        <button onClick={ signOut } >
            <FiLogOut color="#000"  size={24}/>
        </button>
    )
}