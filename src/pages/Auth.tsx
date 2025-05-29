import {useState} from "react";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {auth, googleProvider} from "../core/firebase.ts";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: unknown) {
            alert((err as Error).message);
        }
    };

    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registration successful! You can now log in.");
        } catch (err: unknown) {
            alert((err as Error).message);
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: unknown) {
            console.error("Google Sign-In Error:", (err as Error));
            alert("Google login failed");
        }
    };

    return (
        <div className="flex align-items-center justify-content-center h-screen bg-gray-50">
            <Card className="w-25rem shadow-3 border-round-lg">
                <div className="flex flex-column align-items-center mb-4">
                    <i className="pi pi-clock text-4xl text-blue-500 mb-2"/>
                    <h2 className="m-0 text-2xl font-bold">TimeFlow</h2>
                    <p className="text-gray-600">Simple Time Tracking Solution</p>
                </div>

                <div className="p-fluid">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <div className="p-inputgroup flex-1 mb-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope"/>
                        </span>
                        <InputText
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <label htmlFor="password" className="block mb-2">Password</label>
                    <span className="p-input-icon-left mb-3">
                        <i className="pi pi-lock"/>
                        <Password
                            id="password"
                            toggleMask
                            feedback={false}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </span>

                    <Button
                        label="Log In"
                        className="mb-2"
                        onClick={login}
                    />

                    <Button
                        label="Register"
                        severity="success"
                        className="mb-2"
                        onClick={register}
                    />

                    <Button
                        label="Sign in with Google"
                        icon="pi pi-google"
                        severity="danger"
                        className="mb-3"
                        onClick={loginWithGoogle}
                    />

                    <Divider/>

                    <div className="text-center text-sm mb-2">
                        <a href="#" className="text-primary">Forgot Password?</a>
                    </div>
                </div>
            </Card>
        </div>
    );
}
