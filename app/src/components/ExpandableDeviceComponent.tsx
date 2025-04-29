import { useState } from "react";

import { supabase } from "../lib/helper/SupabaseClient";

import { device, selectedGolfer as selectedMember } from "../types/types";
import { Member } from "../types/DatabaseTypes";

import "../styles/ExpandableDeviceComponent.css"
import { GolferComponent } from "./GolferComponent";

export function ExpandableDeviceComponent(props: { device: device, sendInitializeCommand: Function, closePopup: Function, companyId: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedGolfer] = useState<Member | null>(null);

    async function queryMembers() {
        const name = (document.getElementById("name") as HTMLInputElement).value;

        if (name === "") {
            setMembers([]);
            return;
        }

        const { data, error } = await supabase.from("members").select().or(`firstName.ilike.${name}%,lastName.ilike.${name}%`).eq("company_id", props.companyId);

        if (error) {
            console.log(error);
        }

        if (data) {
            setMembers(data);
        } else {
            setMembers([]);
        }
    }

    function closeExpandableDeviceComponent() {
        setIsExpanded(false);
        setMembers([]);
        setSelectedGolfer(null);
    }

    function handleGolferClick(member: Member) {
        setSelectedGolfer(member);

        (document.getElementById("name") as HTMLInputElement).value = member.firstName + " " + member.lastName;

        setMembers([]);
    }

    function sendInitializeCommand() {
        if (!selectedMember) {
            alert("Please select a golfer");
            return;
        }

        let golfer: selectedMember = {
            id: selectedMember.member_Id,
            name: selectedMember.firstName + " " + selectedMember.lastName
        };

        props.sendInitializeCommand(golfer);
        props.closePopup(false);
    }

    return (
        <div className="container">
            <div className="device">
                <div className="device-info">
                    <img src="raspberrypi.png" />
                    <h3>{props.device["name"]}</h3>
                </div>
                {isExpanded ? <div className="arrow" onClick={closeExpandableDeviceComponent}>&#9650;</div> : <div className="arrow" onClick={() => setIsExpanded(true)}>&#9660;</div>}
            </div>
            {isExpanded ?
                <div className="device-initialize">
                    <div className='input-wrap'>
                        <div className="input">
                            <input id="name" placeholder="" onChange={queryMembers} />
                            <div className="label">
                                <label htmlFor="name">Golfer Name</label>
                            </div>
                        </div>
                        {members.length > 0 ?
                            <div className="autocomplete">
                                {members.map((golfer) => {
                                    return (
                                        <GolferComponent member={golfer} handleGolferClick={handleGolferClick} />
                                    )
                                })}
                            </div> : <></>}
                    </div>
                    <div className="initialize">
                        <button className="button" onClick={sendInitializeCommand}>Initialize</button>
                    </div>
                </div> : <></>}
        </div>
    );
}