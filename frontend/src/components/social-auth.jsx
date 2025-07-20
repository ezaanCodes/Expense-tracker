/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import api from "../libs/apiCall";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export const SocialAuth = ({ isLoading, setLoading }) => {
    const [user] = useAuthState(auth)
    const [selectedProvider, setSelectedProvider] = useState("google");
    const { setCredentials } = useStore((state) => state);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setSelectedProvider("google");
        try {
            const res = await signInWithRedirect(auth, provider)

        } catch (error) {
            console.log("Error Signing with google", error)
        }
    }
    const signInWithGithub = async () => {
        const provider = new GithubAuthProvider();
        setSelectedProvider("github");
        try {
            const res = await signInWithRedirect(auth, provider)

        } catch (error) {
            console.log("Error Signing with google", error)
        }
    }
    useEffect(() => {
        const saveUserToDb = async () => {
            try {
                const userData = {
                    firstName: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    password: "social_auth_no_password", // Dummy password for social auth
                    provider: selectedProvider,
                    uid: user.uid,
                    isSocialAuth: true

                }
                setLoading(true)

                const { data: res } = await api.post("/auth/sign-up", userData)
                console.log(res)

                if (res?.user) {
                    toast.success(res?.message);
                    const userInfo = { ...res?.user, token: res?.token };
                    localStorage.setItem("user", JSON.stringify(userInfo))

                    setCredentials(userInfo)

                    setTimeout(() => {
                        navigate("/overview")
                    }, 1500)

                }
            } catch (error) {
                console.error("Something went wrong", error)
                toast.error(error?.response?.data?.message || error.message)
            }
            finally {
                setLoading(false)
            }
        }

        if (user) {
            saveUserToDb()
        }
    }, [user?.uid])


    return (
        <div className="flex items-center gap-2 ">
            <Button
                onClick={signInWithGoogle}
                disabled={isLoading}
                variant="overview"
                className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 border border-gray-300 dark:text-gray-400"
                type="button"
            >
                <FcGoogle className="mr-2 size-12" />
                <span>

                    Continue with google
                </span>
            </Button>

            <Button
                onClick={signInWithGithub}
                disabled={isLoading}
                variant="overview"
                className="w-full text-sm font-normal border border-gray-300 dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
                type="button"
            >
                <FaGithub className="mr-2 size-12" /> Continue with Github
            </Button>


        </div>
    )
}