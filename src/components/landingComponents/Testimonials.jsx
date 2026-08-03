import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Anderson',
      role: 'Travel Enthusiast',
      content: 'WanderWise completely changed how I plan vacations. The collaboration features made organizing a group trip with friends so much easier!',
      rating: 5,
      avatar: '👩‍🦰'
    },
    {
      name: 'Marcus Chen',
      role: 'Business Traveler',
      content: 'As someone who travels frequently for work, having all my bookings and itineraries in one place is a game-changer. Highly recommend!',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Adventure Seeker',
      content: 'The destination recommendations are incredibly accurate. WanderWise helped me discover hidden gems I would have never found otherwise.',
      rating: 5,
      avatar: '👩‍🎤'
    },
    {
      name: 'James Wilson',
      role: 'Family Trip Planner',
      content: 'Planning family vacations is no longer stressful. Everyone can see the itinerary and contribute ideas. Absolutely love this platform!',
      rating: 5,
      avatar: '👨‍👩‍👧‍👦'
    }
  ];

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Loved by Travelers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy travelers who are already using WanderWise to plan their adventures.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-lg p-8 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <div className="text-3xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-gray-200">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">10K+</p>
            <p className="text-gray-600">Active Travelers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">4.9★</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">150+</p>
            <p className="text-gray-600">Countries Served</p>
          </div>
        </div>
      </div>
    </section>
  );
}
