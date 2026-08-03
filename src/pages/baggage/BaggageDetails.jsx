import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import useApi from '@/hooks/useApi';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import api from '@/api/axios';
import { toast } from 'sonner';


const formSchema = z.object({
    name: z.string().min(3, "Name of item must be atleast 3 characters")
})

const BaggageDetails = () => {

    const [dependency, setDependency] = React.useState(0);
    const [addOpen, setAddOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    const { tripId } = useParams();

    const { data, loading, error } = useApi(`/${tripId}/baggages`, {}, [dependency]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const editForm = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    React.useEffect(() => {
        if (editingItem) {
            editForm.reset({ name: editingItem.name });
        }
    }, [editingItem]);

    if (loading) {
        return <Loader2 className='animate-spin mt-40 mx-auto' />
    }

    if (error) {
        return <div className="mt-40 text-center">Error: {error.message}</div>
    }

    const onSubmit = async (formData) => {
        try {
            const response = await api.post(`/${tripId}/baggages`, formData);

            if (response.status == 201) {
                toast.success("Baggage created successfully");
                form.reset();
                setAddOpen(false);
                setDependency(dependency+1);
            } else {
                toast.error(response.message || "Error creating baggage");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Some error occured");
        }
    }

    const onEdit = async (formData) => {
        try {
            const response = await api.patch(`/${tripId}/baggages/${editingItem._id}`, {
                ...formData,
                completed: editingItem.completed
            });

            if (response.status == 200) {
                toast.success("Baggage updated successfully");
                setEditingItem(null);
                setDependency(dependency+1);
            } else {
                toast.error(response.message || "Error updating baggage");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Some error occured");
        }
    }

    const onDelete = async (id) => {
        try {
            const response = await api.delete(`/${tripId}/baggages/${id}`);

            if (response.status == 200) {
                toast.success("Baggage deleted successfully");
                setDependency(dependency+1);
            } else {
                toast.error(response.message || "Error deleting baggage");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Some error occured");
        }
    }

    const onCheck = async (id, status, name) => {
        try {
            const response = await api.patch(`/${tripId}/baggages/${id}`, {completed: !status, name: name});

            if (response.status == 200) {
                if(response.data.data.completed){ 
                    toast.success("Baggage packed successfully");
                }else{
                    toast.success("Baggage unpacked successfully!");
                }
                setDependency(dependency+1);
            } else {
                toast.error(response.message || "Error updating baggage");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Some error occured");
        }
    }

    return (
        <section className='mt-20 px-20 py-12'>
            <Card>
                <CardHeader>
                    <CardTitle>Baggage List</CardTitle>
                    <CardDescription>All the items you need for this trip</CardDescription>
                    <CardAction>
                        <Dialog open={addOpen} onOpenChange={setAddOpen}>
                            <DialogTrigger >
                                Add Baggage
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Baggage</DialogTitle>
                                    <DialogDescription>
                                        Enter the name of item you want to take to trip.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>Enter item name</FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    type="text"
                                                    placeholder="Medicines"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    <Button type="submit" className={"mt-4 w-full"}>Submit</Button>
                                </form>

                            </DialogContent>
                        </Dialog>
                    </CardAction>
                </CardHeader>

                <CardContent className={"grid grid-cols-3 gap-4"}>
                    {
                        data.length == 0 ?
                            <div>No baggages for this trip. Add baggage with the help of button above.</div>
                            :
                            data.map((item) => {
                                return (
                                    <div key={item._id} className={` ${item.completed ? "bg-primary/10" : ""} flex items-center justify-between border border-gray-200 p-4 rounded-md`}>
                                        <div className='flex gap-2 items-center'>
                                            <Checkbox 
                                            onClick={()=>{onCheck(item._id, item.completed, item.name)}} 
                                            checked={item.completed} />
                                            <p>{item.name}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <Button size='icon' variant='outline' onClick={() => setEditingItem(item)}>
                                                <Edit />
                                            </Button>
                                            <Button size='icon' variant='outline'
                                                onClick={()=>{onDelete(item._id)}}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </CardContent>
            </Card>

            <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) setEditingItem(null) }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Baggage</DialogTitle>
                        <DialogDescription>
                            Update the name of this item.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={editForm.handleSubmit(onEdit)}>
                        <Controller
                            name="name"
                            control={editForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Enter item name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="text"
                                        placeholder="Medicines"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button type="submit" className={"mt-4 w-full"}>Save Changes</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default BaggageDetails
