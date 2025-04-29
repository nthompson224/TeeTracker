
import { Member } from "../types/DatabaseTypes";

import "../styles/GolferManagementAddPopup.css";
import { supabase } from "../lib/helper/SupabaseClient";

export function InitializedDevicePopup(props: { show: Boolean, closePopup: Function, selectedMember: Member, sendUninitializeCommand: Function, companyId: string }) {
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
                                <input type="text" disabled={true} id="member-name" placeholder="" defaultValue={`${props.selectedMember.firstName} ${props.selectedMember.lastName}`} />
                                <div className="label">
                                    <label htmlFor="member-name">Member Name</label>
                                </div>
                            </div>
                            <div className="register-company-input">
                                <input type="text" id="member-id" disabled={true} placeholder="" defaultValue={props.selectedMember.member_Id} />
                                <div className="label">
                                    <label htmlFor="member-id">Member ID</label>
                                </div>
                            </div>
                        </div>
                        <div className="add-delete">
                            <button className="deinitialize-button" onClick={() => props.sendUninitializeCommand(props.selectedMember)}>Deinitialize</button>
                        </div>
                    </div>
                </div>
            </div > : <></>
    )
}