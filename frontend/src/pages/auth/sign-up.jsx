import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import useStore from '../../store';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { SocialAuth } from '../../components/social-auth';
import { Separator } from '../../components/separator';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { BiLoader } from "react-icons/bi"
import { toast, Toaster } from 'sonner';
import api from '../../libs/apiCall';
const RegisterSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
    firstName: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),
    password: z
        .string({ required_error: "Name is required" })
        .min(8, "Password must be 8 long")
});

const SignUp = () => {
    const { user } = useStore((state) => state)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(RegisterSchema)
    })
    const navigate = useNavigate();

    const [loading, setLoading] = useState();

    useEffect(() => {

        user && navigate("/")

    }, [navigate, user])

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const { data: res } = await api.post("/auth/sign-up", data)
            if (res?.user) {
                toast.success("Account Created successfully. You can now Login")
                setTimeout(() => {
                    navigate("/sign-in")
                }, 1500)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10 '>
            <Card className="w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
                <div className='p-6 md:p-8'>
                    <CardHeader className="py-0">
                        <CardTitle className="mb-8 text-center dark:text-white">
                            Create Account
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 ' >
                            <div className='mb-8 space-y-6'>

                                <SocialAuth isLoading={loading} setLoading={setLoading} />

                                <Separator />

                                <Input
                                    disabled={loading}
                                    id="firstName"
                                    label="Name"
                                    name="firstName"
                                    type="text"
                                    placeholder="Jon doe"
                                    error={errors?.firstName?.message}
                                    {...register("firstName")}
                                    className='text-sm border dark:border-gray-800 
                                    dark:bg-transparent dark: placeholder:text-gray-700 
                                    dark:text-gray-400 dark:outline-none'
                                />
                                <Input
                                    disabled={loading}
                                    id="email"
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    error={errors?.email?.message}
                                    {...register("email")}
                                    className='text-sm border dark:border-gray-800 
                                    dark:bg-transparent dark: placeholder:text-gray-700 
                                    dark:text-gray-400 dark:outline-none'
                                />
                                <Input
                                    disabled={loading}
                                    id="password"
                                    label="Password"
                                    type="password"
                                    placeholder="********"
                                    error={errors?.password?.message}
                                    {...register("password")}
                                    className='text-sm border dark:border-gray-800 
                                    dark:bg-transparent dark: placeholder:text-gray-700 
                                    dark:text-gray-400 dark:outline-none'
                                />

                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-violet-800 "
                                disabled={loading}
                            >
                                {loading ? <BiLoader className="text-2xl text-white animate-spin" /> : "Create an Account"}

                            </Button>

                        </form>
                    </CardContent>

                </div>
                <CardFooter className="justify-center gap-2">
                    <p className='text-sm text-gray-600'>
                        Already have an Account
                    </p>
                    <Link
                        to="/sign-in"
                        className='text-sm font font-semibold text-violet-600 hover:underline'
                    >
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignUp