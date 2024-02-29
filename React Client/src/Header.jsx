import React from 'react'
import { BsSearch, BsJustify } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function Header({ OpenSidebar }) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const ID = localStorage.getItem('ID');

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('ID');
        navigate('/');

    };
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            {/* <BsSearch  className='icon'/> */}
        </div>
        <div className='header-right'>
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Welcome {username}
                </a>
                <ul className="dropdown-menu">

                    <li><a className="dropdown-item" href={`/userprofile/${ID}`}><i class="fa-solid fa-user"></i> Profile</a></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
                </ul>
            </div>
    </header>
  )
}

export default Header