import { MapPinned, Plane, Sparkles, Users, Wallet } from 'lucide-react'
import React from 'react'
import CustomButton from '../shared/CustomButton'

const Features = () => {

  const featuresData = [
    {
      icon: MapPinned,
      title: "Smart Itineraries",
      description: "Build organized travel plans with destinations, activities, schedules, and recommendations in one place."
    },
    {
      icon: Users,
      title: "Group Planning",
      description: "Coordinate trips with friends, share updates, assign tasks, and manage decisions collaboratively."
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      description: "Monitor travel budgets, record shared expenses, split costs fairly, and avoid overspending."
    },
    {
      icon: Plane,
      title: "Booking Manager",
      description: "Keep flights, accommodations, and reservations organized with quick access throughout your journey."
    }
  ]

  return (
    <section className='px-20 py-32'>
      <div>
        <h2 className='text-2xl md:text-3xl lg:text-5xl font-bold mb-6 text-center'>Everything you need to plan smarter</h2>
        <p className='text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16'>
          From the first idea to the last day of your trip, WanderWise keeps everything organized in one place.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {
          featuresData.map((feature, index) => {
            return (
              <div key={index} className="border border-gray-300 p-6 rounded-lg bg-blue-50">
                <feature.icon className='h-10 w-10 text-blue-700 ' />

                <h3 className="text-xl font-medium my-2">{feature.title}</h3>

                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })
        }
      </div>

      <div className='mt-16 flex flex-col items-center gap-4 text-center'>
        <div className='flex items-center gap-2 text-blue-700 font-medium'>
          <Sparkles className='h-5 w-5' />
          <span>Ready to plan your next adventure?</span>
        </div>
        <CustomButton text="Get Started" link="/login" />
      </div>

    </section>
  )
}

export default Features