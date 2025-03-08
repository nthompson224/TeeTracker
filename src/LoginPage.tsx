import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from './lib/helper/SupabaseClient';

import "./styles/LoginRegister.css";

export function LoginPage() {
    const loginRedirect = useNavigate();
    const [loginErrors, setLoginErrors] = useState<string[]>([]);

    async function loginUser() {
        let tempLoginErrors: string[] = [];

        const email = (document.getElementById("email")! as HTMLInputElement).value;
        const password = (document.getElementById("password")! as HTMLInputElement).value;

        if (email === "") {
            tempLoginErrors.push("* Email can't be blank.");
        }
        if (password === "") {
            tempLoginErrors.push("* Passowrd can't be blank.");
        }

        if (tempLoginErrors.length !== 0) {
            setLoginErrors(tempLoginErrors);
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            const newLoginErrors = [...loginErrors, error.message];
            setLoginErrors(newLoginErrors);
            return
        }
        if (data) {
            loginRedirect("/");
        }
    }

    return (
        <div className="login-register-page">
            <div className="content">
                <h1>
                    <i>TeeTracker</i>
                </h1>
                <div className="login-error">
                </div>
                <div className="input-wrap">
                    <div className="input">
                        <input type="text" id="email" placeholder="" />
                        <div className="label">
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                </div>
                <div className="input">
                    <input type="password" id="password" placeholder="" />
                    <div className="label">
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <button onClick={loginUser}>Login</button>
                <Link to="/register">Register</Link>
            </div>
        </div>
    );
}