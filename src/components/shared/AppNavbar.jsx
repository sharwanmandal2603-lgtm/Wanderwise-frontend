import React from 'react'
import CustomButton from '../shared/CustomButton'
import { NavLink } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

const AppNavbar = () => {

    const {logout, role} = useAuth();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const navLinkClass = "block md:inline py-2 md:py-0 border-b md:border-none border-gray-100";

  return (
    <header className="px-4 sm:px-6 md:px-8 lg:px-20 py-4 fixed top-0 z-30 bg-white w-full">
        <div className="flex justify-between items-center">
            {/* left part */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">WanderWise</h1>
            </div>

            {/* right part  */}
            <div className='flex items-center gap-3 md:gap-16'>
                <nav className='hidden md:block text-lg space-x-8'>
                    <NavLink to={"/trips"} >Trips</NavLink>
                    <NavLink to={"/itinerary"} >Itinerary</NavLink>
                    <NavLink to={"/baggage"} >Baggage</NavLink>
                    {role === 'admin' && <NavLink to={"/dashboard/admin"} >Admin</NavLink>}
                </nav>

                <div className="hidden md:block" onClick={logout}>
                    <CustomButton text="Logout"/>
                </div>

                {/* mobile menu toggle */}
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    { mobileOpen ? <X /> : <Menu /> }
                </Button>
            </div>
        </div>

        {/* mobile menu panel */}
        {
            mobileOpen &&
            <nav className="md:hidden mt-4 pb-2 text-lg [&>a]:text-base">
                <NavLink onClick={() => setMobileOpen(false)} className={navLinkClass} to={"/trips"}>Trips</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} className={navLinkClass} to={"/itinerary"}>Itinerary</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} className={navLinkClass} to={"/baggage"}>Baggage</NavLink>
                {role === 'admin' && <NavLink onClick={() => setMobileOpen(false)} className={navLinkClass} to={"/dashboard/admin"}>Admin</NavLink>}

                <div className="mt-4" onClick={() => { setMobileOpen(false); logout(); }}>
                    <CustomButton text="Logout"/>
                </div>
            </nav>
        }
    </header>
  )
}

export default AppNavbar