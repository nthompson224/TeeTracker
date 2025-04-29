
import { Member } from "../types/DatabaseTypes";

import "../styles/GolferManagementAddPopup.css";
import { supabase } from "../lib/helper/SupabaseClient";

export function GolferManagementAddPopup(props: { show: Boolean, closePopup: Function, members: Member[] | undefined, setMembers: Function, companyId: string }) {
    async function addMember() {
        const name = (document.getElementById("member-name") as HTMLInputElement).value;
        const id = (document.getElementById("member-id") as HTMLInputElement).value;

        if (name === "") {
            alert("Name cannot not be blank");
            return;
        }

        if (id === "") {
            alert("ID cannot not be blank");
            return;
        }

        let duplicateID = false;

        props.members?.map((member) => {
            if (member.member_Id === parseInt(id)) {
                duplicateID = true;
            }
        })

        if (duplicateID) {
            alert("You cannot have duplicate member IDs");
            return;
        }

        const { data, error } = await supabase.from("members").insert({
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            member_Id: parseInt(id),
            company_id: props.companyId
        });

        if (error) {
            alert(error);
            return;
        }

        props.closePopup(!props.show);

        (document.getElementById("member-name") as HTMLInputElement).value = "";
        (document.getElementById("member-id") as HTMLInputElement).value = "";
    }

    return (
        props.show ?
            <div className="popup">
                <div className="golfer-management-popup-content">
                    <div className="popup-header">
                        <button className="close-button" onClick={() => props.closePopup(false)}>X</button>
                    </div>
                    <div className="add-member-form">
                        <div className="input-wrap">
                            <div className="register-company-input">
                                <input type="text" id="member-name" placeholder="" />
                                <div className="label">
                                    <label htmlFor="member-name">Member Name</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="text" id="member-id" placeholder="" />
                                <div className="label">
                                    <label htmlFor="member-id">Member ID</label>
                                </div>
                            </div>
                        </div>
                        <button className="add-member-button" onClick={addMember}>Add</button>
                    </div>
                </div>
            </div > : <></>
    )
}