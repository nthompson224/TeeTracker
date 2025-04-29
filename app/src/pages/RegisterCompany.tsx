import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AddMemberPopup } from "../components/AddMemberPopup";

import { supabase } from "../lib/helper/SupabaseClient";

import { member } from "../types/types";

import "../styles/RegisterCompany.css"

export function RegisterCompany() {
    const loginRedirect = useNavigate();

    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [members, setMembers] = useState<member[]>();

    async function registerCompany() {
        const companyName = (document.getElementById("company-name") as HTMLInputElement).value;
        const companyDomain = (document.getElementById("company-domain") as HTMLInputElement).value;
        const membersJson = JSON.stringify(members);
        const courseLat = parseFloat((document.getElementById("course-lat") as HTMLInputElement).value);
        const courseLong = parseFloat((document.getElementById("course-long") as HTMLInputElement).value);
        const adminEmail = (document.getElementById("email") as HTMLInputElement).value;
        const adminPassword = (document.getElementById("password") as HTMLInputElement).value;
        const adminConfirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;

        if (companyName === "") {
            alert("Company name can't be blank");
            return;
        }

        if (companyDomain === "") {
            alert("Company domain can't be blank");
            return;
        }

        if (Number.isNaN(courseLat)) {
            alert("Course latitude must be provided")
            return;
        }

        if (Number.isNaN(courseLong)) {
            alert("Course longitude must be provided")
            return;
        }

        if (adminEmail === "") {
            alert("Admin email can't be blank");
            return;
        }

        if (adminEmail.split("@")[1] !== companyDomain) {
            alert("Admin email domain should be the same as company's domain");
            return;
        }

        if (adminPassword === "") {
            alert("Admin password can't be blank");
            return;
        }

        if (adminPassword !== adminConfirmPassword) {
            alert("Passwords don't match");
            return;
        }

        if (!(await signupAdmin(adminEmail, adminPassword)).valueOf()) {
            alert("Error registering admin account");
            return;
        }

        const { data, error } = await supabase.from("registered_companies").insert({
            company_name: companyName,
            domain: companyDomain,
            members: membersJson,
            course_latitude: courseLat,
            course_longitude: courseLong
        }).select();

        console.log(data)

        if (error) {
            console.log(error);
        }

        const updatedMembers = await assignCompanyIdToMembers(data![0].company_id);

        if (!(await insertMembers(updatedMembers).valueOf())) {
            alert("Error uploading members");
            return;
        }

        (document.getElementById("company-name") as HTMLInputElement).value = "";
        (document.getElementById("company-domain") as HTMLInputElement).value = "";
        (document.getElementById("course-lat") as HTMLInputElement).value = "";
        (document.getElementById("course-long") as HTMLInputElement).value = "";
        (document.getElementById("email") as HTMLInputElement).value = "";
        (document.getElementById("password") as HTMLInputElement).value = "";
        (document.getElementById("confirm-password") as HTMLInputElement).value = "";

        loginRedirect("/login");
    }

    async function assignCompanyIdToMembers(companyId: string) {
        const updatedMembers = (members ?? []).map((member) => ({
            ...member,
            companyId: companyId
        }));

        setMembers(updatedMembers);
        return updatedMembers;
    }

    async function signupAdmin(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
            }
        );
        if (error) {
            alert(error);
            return false;
        }
        if (data) {
            alert("Success! Your company has successfully been registered.");
        }

        return true;
    }

    async function insertMembers(members: member[]) {
        if (members) {
            console.log(members);
            members.map(async (member) => {
                const { error } = await supabase.from("members").insert({
                    firstName: member.firstName ? member.firstName : "",
                    lastName: member.lastName ? member.lastName : "",
                    member_Id: parseInt(member.id),
                    company_id: member.companyId
                });

                if (error) {
                    console.log(error);
                    return false;
                }
            })
        }

        return true;
    }

    return (
        <div className="base">
            <div className="register-company-main">
                <div className="register-company-content">
                    <div className="add-company-form">
                        <div className="input-wrap">
                            <div className="register-company-input">
                                <input type="text" id="company-name" placeholder="" />
                                <div className="label">
                                    <label htmlFor="company-name">Company Name</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="text" id="company-domain" placeholder="" />
                                <div className="label">
                                    <label htmlFor="company-domain">Company Domain (e.g: gmail.com)</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="float" id="course-long" placeholder="" />
                                <div className="label">
                                    <label htmlFor="course-long">Course Latitude (rounded to the nearest ten-thousandth e.g: 41.0078)</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="number" step={0.0001} id="course-lat" placeholder="" />
                                <div className="label">
                                    <label htmlFor="course-lat">Course Longitude (rounded to the nearest ten-thousandth e.g: 41.0078)</label>
                                </div>
                            </div>
                        </div>
                        <div className="input-wrap">
                            <div className="register-company-input">
                                <input type="text" id="email" placeholder="" />
                                <div className="label">
                                    <label htmlFor="email">Admin Email</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="password" id="password" placeholder="" />
                                <div className="label">
                                    <label htmlFor="password">Admin Password</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="password" id="confirm-password" placeholder="" />
                                <div className="label">
                                    <label htmlFor="confirm-password">Confirm Admin Password</label>
                                </div>
                            </div>
                        </div>
                        <div className="manage-members">
                            <button className="add-employee-button" onClick={() => setShowAddMemberPopup(true)}>Add Members</button>
                        </div>
                        <div className="register-company-button">
                            <button className="button" onClick={registerCompany}>Register</button>
                        </div>
                    </div>
                    <div className="teetracker-info">
                        <div className="info-header">
                            <h2><i>T e e T r a c k e r</i></h2>
                        </div>
                        <div className="info-content">
                            <div>📍 Monitor the location of golfers on the course through a live GPS map interface.</div>
                            <div>🗺️ View a Google Maps-based dashboard showing the position of every golf cart equipped with a GPS module.</div>
                            <div>👤 Click on any golfer's marker to view their profile, including name, photo, and contact details.</div>
                            <div>🍔 (Planned Feature) Let members order food and drinks right from the course—know exactly where to deliver them.</div>
                            <div>🔐 Includes a login portal to ensure only authorized staff can access sensitive member data.</div>
                            <div>⚙️ Designed to handle multiple GPS modules and scale to serve several courses or organizations.</div>
                            <div>📶 Powered by SparkFun RedBoard and GPS Breakout for accurate and consistent location updates.</div>
                            <div>🧭 Reduce wait times and personalize service by always knowing where your members are.</div>
                            <div>🏌️‍♂️ Bring your golf course into the digital age with smart, location-based services.</div>
                        </div>
                    </div>
                </div>
                <AddMemberPopup show={showAddMemberPopup} closePopup={setShowAddMemberPopup} members={members} setMembers={setMembers} />
            </div>
        </div>
    );
}