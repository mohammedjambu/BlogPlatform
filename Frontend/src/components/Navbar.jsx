import React from 'react'
import { Link } from 'react-router-dom'
import '../utils css/Navbar.css'

function Navbar() {
  return (
    <nav className='navbar'>
        <Link to="/" className='navbar-brand'>My Blog</Link>

        <ul className='navbar-links'>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/admin/login">Admin Login</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar
