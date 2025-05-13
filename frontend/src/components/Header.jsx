import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignInAlt, FaSignOutAlt, FaUser, FaHeart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

export default function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    const defaultAvatar = user
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=64`
        : '/default-avatar.png'

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo + Navigation */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-bold text-orange-500">
                        MarocZone
                    </Link>
                    <nav className="hidden md:flex space-x-4 text-sm text-gray-700">
                        <Link to="#" className="hover:text-orange-600">For Business</Link>
                        <Link to="#" className="hover:text-orange-600">Career</Link>
                        <Link to="#" className="hover:text-orange-600">Help</Link>

                        <div className="relative group">
                            <button className="hover:text-orange-600 flex items-center">
                                Catalogs <span className="ml-1">▾</span>
                            </button>
                            <div className="hidden group-hover:block absolute top-full left-0 bg-white border mt-1 w-40 shadow-md p-2 text-sm z-10 transition-all duration-200 ease-out">
                                <Link to="#" className="block py-1 hover:bg-orange-50">Catalog 1</Link>
                                <Link to="#" className="block py-1 hover:bg-orange-50">Catalog 2</Link>
                            </div>
                        </div>

                        <Link
                            to="#"
                            className="hover:text-orange-600 text-orange-500 font-semibold"
                        >
                            #iHelp
                        </Link>
                    </nav>
                </div>

                {/* Auth & CTA */}
                <div className="flex items-center space-x-4 text-sm relative">
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
                        <>
                            {/* Favorites Button */}
                            <Link 
                                to="/ads/favorites" 
                                className="flex items-center gap-1 text-gray-700 hover:text-orange-600"
                                title="View Favorites"
                            >
                                <FaHeart className="text-orange-500" /> 
                                <span className="hidden sm:inline">Favorites</span>
                            </Link>
                            
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 focus:outline-none"
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                >
                                    <span className="font-semibold">{user.name}</span>
                                    <img
                                        src={defaultAvatar}
                                        alt={`${user.name} avatar`}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 flex flex-col bg-white border rounded shadow-md mt-2 z-50 min-w-[160px] animate-fade-in">
                                        <Link
                                            to="/profile"
                                            className="px-4 py-2 hover:bg-gray-100 border-b"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to={`/ads/myads`}
                                            className="px-4 py-2 hover:bg-gray-100 border-b"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Ads
                                        </Link>
                                        <Link
                                            to={`/favorites`}
                                            className="px-4 py-2 hover:bg-gray-100 border-b"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaHeart /> Favorites
                                            </div>
                                        </Link>
                                        <Link
                                            to={`/ads/populare`}
                                            className="px-4 py-2 hover:bg-gray-100 border-b"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Populare Ads
                                        </Link>
                                        <button
                                            onClick={() => {
                                                onLogout()
                                                setIsDropdownOpen(false)
                                            }}
                                            className="text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaSignOutAlt /> Logout
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <Link
                        to="/ads/add"
                        className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition-all"
                    >
                        Place an Ad
                    </Link>
                </div>
            </div>
        </header>
    )
}