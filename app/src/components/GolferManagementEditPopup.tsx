
import { Member } from "../types/DatabaseTypes";

import "../styles/GolferManagementAddPopup.css";
import { supabase } from "../lib/helper/SupabaseClient";

export function GolferManagementEditPopup(props: { show: Boolean, closePopup: Function, selectedMember: Member, members: Member[] | undefined, setMembers: Function, companyId: string }) {
    async function editMember() {
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
            if (member.member_uuid !== props.selectedMember.member_uuid && member.member_Id === parseInt(id)) {
                duplicateID = true;
            }
        })

        if (duplicateID) {
            alert("You cannot have duplicate member IDs");
            return;
        }

        const { data, error } = await supabase.from("members").update({
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            member_Id: parseInt(id)
        }).eq("member_uuid", props.selectedMember.member_uuid);

        if (error) {
            console.log(error)
            return;
        }

        props.closePopup();

        (document.getElementById("member-name") as HTMLInputElement).value = "";
        (document.getElementById("member-id") as HTMLInputElement).value = "";
    }

    async function deleteMember() {
        if (window.confirm("Are you sure you want to delete this member?")) {
            console.log(props.selectedMember);
            const { error } = await supabase.from("members").delete().eq("member_uuid", props.selectedMember.member_uuid);

            if (error) {
                alert(error);
                return;
            } else {
                alert("Member successfully deleted");
                props.closePopup();
            }
        }
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
                                <input type="text" id="member-name" placeholder="" defaultValue={`${props.selectedMember.firstName} ${props.selectedMember.lastName}`} />
                                <div className="label">
                                    <label htmlFor="member-name">Member Name</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="text" id="member-id" placeholder="" defaultValue={props.selectedMember.member_Id} />
                                <div className="label">
                                    <label htmlFor="member-id">Member ID</label>
                                </div>
                            </div>
                        </div>
                        <div className="add-delete">
                            <button className="add-member-button" onClick={editMember}>Save</button>
                            <button className="add-member-button" onClick={deleteMember}>Delete</button>
                        </div>
                    </div>
                </div>
            </div > : <></>
    )
}