import React from 'react'
import CustomButton from '../shared/CustomButton'

const Hero = () => {
    return (
        <section className="relative top-20">
            <div className="h-[90vh] overflow-hidden flex items-center">
                <img src="/heroImage.jpg" alt="wanderwise hero" className="w-full" />
            </div>

            <div className="bg-black opacity-70 h-[90vh] w-full absolute top-0"></div>

            <div className='absolute top-0'>
                <div className="w-1/2 mx-auto mt-40 text-center">
                    <h1 className='text-5xl text-white font-bold'>Plan your trip with Wanderwise</h1>
                    <p className='text-xl text-white  my-8'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam nisi, tempore expedita adipisci repudiandae, nostrum esse ipsa provident voluptate ad ab dignissimos? Voluptate aliquam consequatur doloremque officiis quidem nesciunt vitae asperiores rerum quasi, sapiente distinctio quia facere necessitatibus. Repudiandae cum maxime nihil error nisi voluptatem vero enim porro earum suscipit!
                    </p>

                    <div className="flex justify-center">
                        <CustomButton text="Get Started" link="/login" />
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Hero