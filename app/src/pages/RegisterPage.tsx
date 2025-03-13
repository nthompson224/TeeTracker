import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/helper/SupabaseClient";

import "../styles/LoginRegister.css";

export function RegisterPage() {
    const registerRedirect = useNavigate();
    const [registerErrors, setRegisterErrors] = useState<string[]>([]);

    async function handleRegisterClick() {
        let tempRegisterError: string[] = [];
        const email = (document.getElementById("email")! as HTMLInputElement).value;
        const password = (document.getElementById("password")! as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirmPassword")! as HTMLInputElement).value;

        if (email === "") {
            tempRegisterError.push("Email can't be blank.");
        }
        if (password === "") {
            tempRegisterError.push("Password can't be the blank.");
        }
        if (confirmPassword !== password && password !== "") {
            tempRegisterError.push(
                "Password and confirm password must be the same."
            );
        }

        if (tempRegisterError.length !== 0) {
            setRegisterErrors(tempRegisterError);
            return;
        }

        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
            }
        );
        if (error) {
            const newTempRegisterError = [...tempRegisterError, error.message];
            setRegisterErrors(newTempRegisterError);
            return;
        }
        if (data) {
            registerRedirect("/");
        }
    }

    return (
        <div className="login-register-page">
            <div className="content">
                <h1>
                    <i>TeeTracker</i>
                </h1>
                <div className="login-error">
                    {registerErrors.length !== 0 ? (
                        registerErrors.map((e) => <p key={e}>* {e}</p>)
                    ) : (
                        <></>
                    )}
                </div>
                <div className="input-wrap">
                    <div className="input">
                        <input type="email" id="email" placeholder="" />
                        <div className="label">
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="input">
                        <input type="password" id="password" placeholder="" />
                        <div className="label">
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="input">
                        <input type="password" id="confirmPassword" placeholder="" />
                        <div className="label">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                    </div>
                </div>
                <button className="button" type="submit" onClick={handleRegisterClick}>
                    Register
                </button>
            </div>
        </div>
    );
}