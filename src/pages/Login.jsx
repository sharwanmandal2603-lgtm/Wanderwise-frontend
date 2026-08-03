import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from "zod"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeClosed } from 'lucide-react'
import api from '@/api/axios'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password should be at least 8 characters."),
})

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [show, setShow] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (formData) => {
        console.log(formData);

        try {
            const response = await api.post("/auth/login", formData);

            console.log(response);
            
            if(response.status === 200){
                toast.success("Logged in Successfully!");

                const token = response.data.data.token;
                login(formData, token);
                
                navigate("/dashboard");
            }else{
                toast.error(response.message || "Login Failed");
            }
        } catch (error) {
            toast.error(error.message || "Login Failed");
            console.log(error);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-1/4 mx-auto mt-32">
                <CardHeader>
                    <CardTitle>Login to WanderWise</CardTitle>
                    <CardDescription>Fill your details to login</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="ram.bahadur@example.com"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <div className='flex items-end gap-1'>
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type={show ? "text" : "password"}
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button onClick={() => { setShow(!show) }} type="button" size="icon" variant='outline'>
                            {
                                show ? <EyeClosed /> : <Eye />
                            }
                        </Button>

                    </div>

                </CardContent>
                <CardFooter className="block">
                    <Button type="submit" className="w-full">Login</Button>

                    <div className="mt-2 text-center">
                        Don't have an account? 
                        <a className="text-blue-500 underline" href="/register">Register</a>
                    </div>
                </CardFooter>
            </Card>

        </form>
    )
}

export default Login