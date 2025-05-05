import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

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
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo + Nav */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-bold text-orange-500">MarocZone</Link>
                    <nav className="hidden md:flex space-x-4 text-sm text-gray-700">
                        <Link to="#" className="hover:text-orange-600">For Business</Link>
                        <Link to="#" className="hover:text-orange-600">Career</Link>
                        <Link to="#" className="hover:text-orange-600">Help</Link>
                        <div className="relative group">
                            <button className="hover:text-orange-600">Catalogs ▾</button>
                            <div className="hidden group-hover:block absolute top-full left-0 bg-white border mt-1 w-40 shadow-md p-2 text-sm z-10">
                                <Link to="#" className="block py-1 hover:bg-orange-50">Catalog 1</Link>
                                <Link to="#" className="block py-1 hover:bg-orange-50">Catalog 2</Link>
                            </div>
                        </div>
                        <Link to="#" className="hover:text-orange-600 text-orange-500 font-semibold">#iHelp</Link>
                    </nav>
                </div>

                {/* Auth & CTA */}
                <div className="flex items-center space-x-4 text-sm">
                    {!user ? (
                        <>
                            <Link to="/login" className="flex items-center gap-1 hover:text-orange-600">
                                <FaSignInAlt /> Login
                            </Link>
                            <Link to="/register" className="flex items-center gap-1 hover:text-orange-600">
                                <FaUser /> Register
                            </Link>
                        </>
                    ) : (
                        <button onClick={onLogout} className="flex items-center gap-1 text-red-600 hover:text-red-800">
                            <FaSignOutAlt /> Logout
                        </button>
                    )}
                    <Link to={"/add"} className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition-all">
                        Place an Ad
                    </Link>
                </div>
            </div>
        </header>
    )
}
