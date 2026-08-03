import React from 'react'

const Footer = () => {
  return (
    <footer className="px-4 md:px-8 lg:px-20 py-10 md:py-24 bg-blue-900 text-white">
        {/* top div  */}
        <div className='md:grid grid-cols-2 '>
            {/* first part  */}
            <div>
                <h2 className='text-5xl font-bold'>WanderWise</h2>
                <p className='mt-4 text-lg font-medium'>Contact</p>
                <p>+977 9812345678</p>
                <p>+977 9800000000</p>

                <p  className='mt-4 text-lg font-medium'>Address</p>
                <p>Rani, Biratnagar</p>
            </div>

            {/* second part */}
            <div className="flex gap-24">
                <nav className="flex flex-col gap-4 [&>a]:text-xl [&>a]:hover:underline">
                    <a href="/trips">Trips</a>
                    <a href="/baggage">Baggage</a>
                    <a href="/itinerary">Itineraries</a>
                    <a href='/login'>Login</a>
                </nav>

                <nav className="flex flex-col gap-4 [&>a]:text-xl [&>a]:hover:underline">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/help">Help</a>
                </nav>
            </div>

        </div>
    </footer>
  )
}

export default Footer