import React from 'react'
import CustomButton from '../shared/CustomButton'
import { NavLink } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const AppNavbar = () => {

    const {logout, role} = useAuth();

  return (
    <header className="px-4 md:px-8 lg:px-20 py-4 fixed top-0 z-30 bg-white w-full flex justify-between items-center">
        {/* left part */}
        <div>
            <h1 className="text-2xl md:text-4xl font-semibold">WanderWise</h1>
        </div>

        {/* right part  */}
        <div className='flex items-center gap-16'>
            <nav className='hidden md:block text-lg space-x-8'>
                <NavLink to={"/trips"} >Trips</NavLink>
                <NavLink to={"/itinerary"} >Itinerary</NavLink>
                <NavLink to={"/baggage"} >Baggage</NavLink>
                {role === 'admin' && <NavLink to={"/dashboard/admin"} >Admin</NavLink>}
            </nav>

            <div onClick={logout}>
                <CustomButton text="Logout"/>
            </div>
            

        </div>
    </header>
  )
}

export default AppNavbar