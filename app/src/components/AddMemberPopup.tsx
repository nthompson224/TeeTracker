import { member } from "../types/types";

import "../styles/AddMemberPopup.css";

export function AddMemberPopup(props: { show: Boolean, closePopup: Function, members: member[] | undefined, setMembers: Function }) {
    function addMember() {
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
            if (member.id === id) {
                duplicateID = true;
            }
        })

        if (duplicateID) {
            alert("You cannot have duplicate member IDs");
            return;
        }

        const newMember: member = {
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            id: id
        };

        props.members ? props.setMembers([...props.members, newMember]) : props.setMembers([newMember]);

        (document.getElementById("member-name") as HTMLInputElement).value = "";
        (document.getElementById("member-id") as HTMLInputElement).value = "";
    }

    function removeMember(id: string) {
        let tempMembers = props.members
        tempMembers = tempMembers?.filter((member) => {
            return member.id !== id;
        });

        props.setMembers(tempMembers);
    }

    return (
        props.show ?
            <div className="popup">
                <div className="popup-content">
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
                    <div className="added-members-header">
                        <h3>Added Members</h3>
                    </div>
                    <div className="added-members">
                        {props.members ? props.members.map((member) => {
                            return (
                                <div className="member" key={member.id}>
                                    <div className="member-info">
                                        <h3>{member.firstName} {member.lastName}</h3>
                                        <h4>ID: {member.id}</h4>
                                    </div>
                                    <button className="remove-member-button" onClick={() => removeMember(member.id)}>X</button>
                                </div>
                            )
                        }) : <></>}
                    </div>
                </div>
            </div > : <></>
    )
}