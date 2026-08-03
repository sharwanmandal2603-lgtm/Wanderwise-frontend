import useApi from '@/hooks/useApi'
import { Loader2 } from 'lucide-react';
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';
import { useNavigate } from 'react-router-dom';

const Itinerary = () => {

    const navigate = useNavigate();

  const [dependency, setDependency] = React.useState(0);

  const { data, error, loading } = useApi("/trips", {}, [dependency]);

  if (loading) {
    return <Loader2 className="animate-spin mt-40 mx-auto" />
  }

  if (error) {
    return <div className="mt-40 text-center">Error: {error.message}</div>
  }

  return (
    <div className="mt-20 p-20">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold">Your Trips</CardTitle>
          <CardDescription>Select any one trip to show itineraries.</CardDescription>

          <CardAction>
            <a href="/trips/add">
              <Button>Add Trip</Button>
            </a>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              data.length == 0
                ?
                <div>No Trips available to show</div>
                :
                data.map((trip) => {
                  return (
                    <Card key={trip._id}>
                      <CardHeader>
                        <CardTitle>{trip.title}</CardTitle>
                        <CardDescription>{formatDate(trip.startDate)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Budget: <span>{trip.budget.total}</span></p>
                        <p>Spent: <span>{trip.budget.spent}</span></p>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={()=>{navigate(`/itinerary/${trip._id}`)}} className={"w-full"}>View Itineraries</Button>
                      </CardFooter>
                    </Card>
                  )
                })
            }
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default Itinerary
