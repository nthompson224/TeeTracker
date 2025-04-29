import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../lib/helper/SupabaseClient";

import { Company } from "../types/DatabaseTypes";

import "../styles/NavBar.css";

export function NavBar(props: { company?: Company }) {
    const loginRedirect = useNavigate();

    async function handleSignOutClicked() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
        }

        loginRedirect("/login");
    }

    return (
        <div className="nav-bar">
            <div className="logo">
                <div className="text">
                    <h1>
                        <i>T</i>
                        <i>E</i>
                        <i>E</i>
                        <i>T</i>
                        <i>R</i>
                        <i>A</i>
                        <i>C</i>
                        <i>K</i>
                        <i>E</i>
                        <i>R</i>
                    </h1>
                </div>
                <div className="links">
                    <Link className="link" to="/">Home</Link>
                    <Link className="link" to={"/golfer-management"} state={props.company}>Golfer Management</Link>
                    <button className="link" onClick={handleSignOutClicked}>Sign Out</button>
                </div>
            </div>
        </div>
    )
}