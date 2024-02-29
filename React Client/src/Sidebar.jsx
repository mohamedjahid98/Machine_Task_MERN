import React from 'react'
import {BsCart3, BsGrid1X2Fill, BsFillGrid3X3GapFill, BsPeopleFill} from 'react-icons/bs'

function Sidebar({openSidebarToggle, OpenSidebar}) {
    
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                Machine Task MERN
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="/home">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/user">
                    <BsPeopleFill className='icon'/> User 
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="https://mohamed-jahid.netlify.app/">
                    <BsFillGrid3X3GapFill className='icon'/> Blog 
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar