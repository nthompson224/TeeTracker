import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../lib/helper/SupabaseClient";
import { NavBar } from "../components/NavBar";
import { Company, Member } from "../types/DatabaseTypes";
import { GolferComponent } from "../components/GolferComponent";
import { GolferManagementAddPopup } from "../components/GolferManagementAddPopup";
import { GolferManagementEditPopup } from "../components/GolferManagementEditPopup";

import "../styles/GolferManagementPage.css";

export function GolferManagementPage() {
    const location = useLocation();

    const [company, setCompany] = useState<Company>();
    const [members, setMembers] = useState<Member[]>();
    const [selectedMember, setSelectedMember] = useState<Member | undefined>();
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);

    async function getAllMembers(company_id: string) {
        const { data, error } = await supabase.from("members").select().eq('company_id', company_id).order('member_Id', { ascending: true });

        if (error) {
            console.log(error);
        }

        if (data) {
            setMembers(data);
        }
    }

    async function queryMembers() {
        const name = (document.getElementById("golfer-name") as HTMLInputElement).value;
        const id = (document.getElementById("golfer-id") as HTMLInputElement).value;

        if (name === "") {
            getAllMembers(company?.company_id!);
            return;
        }

        if (id === "") {
            const { data, error } = await supabase.from("members").select().or(`firstName.ilike.${name}%,lastName.ilike.${name}%,full_name.ilike.${name}%`).eq("company_id", company?.company_id!).order('member_Id', { ascending: true });

            if (error) {
                console.log(error);
            }

            if (data) {
                setMembers(data);
            } else {
                setMembers([]);
            }
        } else {
            const { data, error } = await supabase.from("members").select().or(`firstName.ilike.${name}%,lastName.ilike.${name}%,full_name.ilike.${name}`).eq("member_Id", parseInt(id)).eq("company_id", company?.company_id!).order('member_Id', { ascending: true });

            if (error) {
                console.log(error);
            }

            if (data) {
                setMembers(data);
            } else {
                setMembers([]);
            }
        }
    }

    function handleMemberClicked(member: Member) {
        setSelectedMember(member);
        setShowEditPopup(true);
    }

    function closeEditPopup() {
        setShowEditPopup(false);
        getAllMembers(company?.company_id!);
    }

    function closeAddPopup() {
        setShowAddPopup(false);
        getAllMembers(company?.company_id!);
    }

    useEffect(() => {
        setCompany(location.state);
        getAllMembers(location.state.company_id)
    }, [location]);

    return (
        <div className="base">
            <NavBar company={company} />
            <div className="main">
                <div className="top-bar">
                    <div className="add-golfer">
                        <button className="add-golfer-button" onClick={() => setShowAddPopup(true)}>+</button>
                    </div>
                    <div className="search-golfers">
                        <div className="golfer-name-input-wrap">
                            <div className="golfer-name-input">
                                <input type="text" id="golfer-name" placeholder="" onChange={() => queryMembers()} />
                                <div className="label">
                                    <label htmlFor="golfer-name">Name</label>
                                </div>
                            </div>
                        </div>
                        <div className="golfer-name-input-wrap">
                            <div className="golfer-name-input">
                                <input type="text" id="golfer-id" placeholder="" onChange={() => queryMembers()} />
                                <div className="label">
                                    <label htmlFor="golfer-id">ID</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="golfer-management-golfers">
                    {members ? members.map((member) => {
                        return (
                            <GolferComponent member={member} handleGolferClick={handleMemberClicked} />
                        );
                    }) : <></>}
                </div>
            </div>
            <GolferManagementAddPopup show={showAddPopup} closePopup={closeAddPopup} members={members} setMembers={setMembers} companyId={company?.company_id!} />
            <GolferManagementEditPopup show={showEditPopup} closePopup={closeEditPopup} selectedMember={selectedMember!} members={members} setMembers={setMembers} companyId={company?.company_id!} />
        </div>
    )
}