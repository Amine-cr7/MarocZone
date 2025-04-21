import React from 'react'
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { reset, logout } from '../features/auth/authSlice'

export default function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }
    return (
        <header className='header'>
            <div className="logo">
                <Link to='/'>Maroc Zone</Link>
            </div>
            <ul>
                {!user ? (
                    <>
                        <li>
                            <Link to={"/login"}>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to={"/register"}>
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>
                ) : (
                <li>
                    <button className='btn' onClick={onLogout}><FaSignOutAlt/> Logout</button>
                </li>
            )}
            </ul>
        </header>
    )
}
