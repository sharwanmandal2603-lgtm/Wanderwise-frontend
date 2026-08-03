import useApi from '@/hooks/useApi'
import { Ellipsis, Loader2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from '@/api/axios';
import { toast } from 'sonner';

const Trip = () => {

  const [dependency, setDependency] = React.useState(0);

  const { data, error, loading } = useApi("/trips", {}, [dependency]);

  console.log(data);

  if (loading) {
    return <Loader2 className="animate-spin mt-40 mx-auto" />
  }

  if (error) {
    return <div className="mt-40 text-center">Error: {error.message}</div>
  }

  const handleDelete = async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}`);

      if(response.status === 200){
        toast.success("Trip deleted successfully");
        setDependency(dependency + 1);
      }else{
        toast.error( response.message || "Error deleting trip");
      }
    } catch (error) {
      console.log(error);
      toast.error( response.message || "Error deleting trip");
    }
  }

  return (
    <div className="mt-20 md:p-8 lg:p-20 p-20">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold">Your Trips</CardTitle>
          <CardDescription>Trips that you are part of.</CardDescription>

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
                        <CardAction>
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
                              <Ellipsis size={16} />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                <DropdownMenuItem><a className="w-full" href={`/trips/${trip._id}`}>View</a></DropdownMenuItem>
                                <DropdownMenuItem><a className="w-full" href={`/trips/edit/${trip._id}`}>Edit</a></DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>{handleDelete(trip._id)}}>Delete</DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>

                          </DropdownMenu>
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <p>Budget: <span>{trip.budget.total}</span></p>
                        <p>Spent: <span>{trip.budget.spent}</span></p>
                      </CardContent>
                      <CardFooter>
                        {
                          trip.destinations.map((destination, destIndex) => {
                            return (
                              <span key={destIndex} className="bg-amber-100 px-2 mr-2 py-1 rounded-lg text-sm">
                                {destination}
                              </span>
                            )
                          })
                        }
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

export default Trip