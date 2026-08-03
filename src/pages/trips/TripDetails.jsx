import api from '@/api/axios';
import InviteForm from '@/components/shared/InviteForm';
import TripInfo from '@/components/shared/TripInfo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useApi from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const TripDetails = () => {

    const [dependency, setDependency] = React.useState(0);

    const { tripId } = useParams();
    console.log(tripId);

    const { error, loading, data } = useApi(`/trips/${tripId}`, {}, [dependency]);

    if (loading) {
        return <Loader2 className="animate-spin mt-40" />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const expenseSubmit = async () => {
        const name = document.getElementById("name");
        const amount = document.getElementById("amount");

        if(!name.value || !amount.value){
            toast.error("Please fill all the fields");
            return;
        }

        const expenseData = {
            name: name.value,
            amount: Number(amount.value),
            date: new Date().toISOString()
        }

        try{
            const response = await api.patch(`/trips/${tripId}/expenses`, expenseData);
            console.log(response);

            if(response.status === 200){
                toast.success("Expense added successfully");
                name.value = "";
                amount.value = "";

                setDependency(dependency + 1);
            }else{
                toast.error( response.message || "Failed to add expense");
            }
        }catch(error){
            toast.error( error.message || "Failed to add expense");
            console.log(error);
        }

    }

    return (
        <section className="px-20 py-4 mt-20 grid grid-cols-4 gap-4">

            <div className="col-span-3 border border-gray-300 rounded-lg p-4 min-h-80">
                <TripInfo trip={data} />
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Add your expense</CardTitle>
                        <CardDescription>Enter details of this expense</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input type="text" id="name" placeholder="Bus Ticket" />
                        </div>
                        <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input type="number" id="amount" placeholder="100" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className={"w-full"} onClick={expenseSubmit} >Add Expense</Button>
                    </CardFooter>
                </Card>

                <InviteForm tripId={tripId} />
            </div>

        </section>
    )
}

export default TripDetails