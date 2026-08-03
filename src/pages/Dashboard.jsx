import useApi from '@/hooks/useApi'
import { formatDate } from '@/lib/formatter'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Loader2, Luggage, MapPin, Plane, Shield, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const Dashboard = () => {

  const navigate = useNavigate();
  const { role } = useAuth();

  const { data, error, loading } = useApi("/trips");

  if (loading) {
    return <Loader2 className="animate-spin mt-40 mx-auto" />
  }

  if (error) {
    return <div className="mt-40 text-center">Error: {error.message}</div>
  }

  const trips = data || [];

  const totalTrips = trips.length;
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0);
  const totalSpent = trips.reduce((sum, trip) => sum + (trip.budget?.spent || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = trips
    .filter((trip) => new Date(trip.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const nextTrip = upcomingTrips[0];

  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 4);

  return (
    <div className="mt-20 p-6 md:p-8 lg:p-20 space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your travel plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold">{totalTrips}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Trips</p>
              <p className="text-2xl font-bold">{upcomingTrips.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${totalBudget}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Wallet className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Trips</CardTitle>
            <CardDescription>A quick look at your most recent trips.</CardDescription>
            <CardAction>
              <Button onClick={() => navigate('/trips/add')}>Add Trip</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {
              recentTrips.length === 0
                ? <p className="text-muted-foreground">You haven't planned any trips yet. Start by adding one!</p>
                : recentTrips.map((trip) => {
                  const budgetProgress = trip.budget?.total
                    ? Math.min((trip.budget.spent / trip.budget.total) * 100, 100)
                    : 0;

                  return (
                    <div
                      key={trip._id}
                      onClick={() => navigate(`/trips/${trip._id}`)}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{trip.title}</p>
                        <Badge variant={new Date(trip.startDate) >= today ? "secondary" : "outline"}>
                          {new Date(trip.startDate) >= today ? "Upcoming" : "Past"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.destinations?.join(", ")}</span>
                      </div>
                      <Progress value={budgetProgress} className="h-1.5" />
                    </div>
                  )
                })
            }
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Trip</CardTitle>
              <CardDescription>Your soonest upcoming adventure.</CardDescription>
            </CardHeader>
            <CardContent>
              {
                nextTrip
                  ? (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">{nextTrip.title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(nextTrip.startDate)}</p>
                      <p className="text-sm text-muted-foreground">{nextTrip.destinations?.join(", ")}</p>
                    </div>
                  )
                  : <p className="text-muted-foreground">No upcoming trips yet.</p>
              }
            </CardContent>
            {
              nextTrip &&
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => navigate(`/trips/${nextTrip._id}`)}>View Trip</Button>
              </CardFooter>
            }
          </Card>

          {
            role === 'admin' &&
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage users and moderate trips platform-wide.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/dashboard/admin')}>
                  <Shield className="h-4 w-4 mr-2" /> Open Admin Panel
                </Button>
              </CardContent>
            </Card>
          }

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate('/trips')}>
                <Plane className="h-4 w-4 mr-2" /> Trips
              </Button>
              <Button variant="outline" onClick={() => navigate('/itinerary')}>
                <Calendar className="h-4 w-4 mr-2" /> Itineraries
              </Button>
              <Button variant="outline" onClick={() => navigate('/baggage')}>
                <Luggage className="h-4 w-4 mr-2" /> Baggage
              </Button>
              <Button variant="outline" onClick={() => navigate('/trips/add')}>
                <MapPin className="h-4 w-4 mr-2" /> New Trip
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
