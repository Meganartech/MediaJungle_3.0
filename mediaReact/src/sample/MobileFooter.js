import React from 'react'
import { BsCollectionPlay } from 'react-icons/bs'
import { CgMenu, CgMenuBoxed } from 'react-icons/cg'
import { FiHeart, FiUserCheck } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const MobileFooter = () => {
    const active = "bg-white text-main"
    const inActive = "transitions text-2xl flex-colo hover:bg-white hover:text-main text-white rounded-md px-4 py-3"
    const Hover = ({ isActive }) =>
    isActive
      ? `transitions text-2xl flex-colo ${active} rounded-md px-4 py-3`
      : `transitions text-2xl flex-colo hover:bg-white hover:text-main text-white rounded-md px-4 py-3`;
  
    return (
        <>
            <div className='flex-btn h-full bg-white rounded cursor-pointer overflow-y-scroll flex-grow w-full'>
                <div>
                    <footer className='lg:hidden fixed z-50 bottom-0 w-full px-1'>
                        <div className='bg-dry rounded-md flex-btn w-full p-1'>
                            <NavLink to="/movies" className={Hover}>
                                <BsCollectionPlay />
                            </NavLink>
                            <NavLink to='/favorites' className={Hover}>
                                <div className='relative'>
                                <div className='w-5 h-5 flex-colo rounded-full text-xs bg-subMain text-white absolute -top-5 -right-1'>
                                    3
                                </div>
                                <FiHeart />
                                </div>
                            </NavLink>
                            <NavLink to="/login" className={Hover}>
                                <FiUserCheck />
                            </NavLink>
                            <button className={inActive}>
                                <CgMenuBoxed />
                            </button>
                        </div>

                    </footer>
                </div>
            </div>
        </>
    )
}

export default MobileFooter