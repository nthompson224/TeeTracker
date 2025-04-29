import { useEffect, useState } from "react";

import { FiEdit } from 'react-icons/fi';

import { device, golfer, member } from "../types/types";
import { supabase } from "../lib/helper/SupabaseClient";
import { Member } from "../types/DatabaseTypes";
import { prependOnceListener } from "process";

const CDNURL = "https://raehtwwdbuzfggmigybx.supabase.co/storage/v1/object/public/golfer-pictures/"

export function InitializedDevice(props: { device: device, setHoveredDevice: Function, handleClick: Function }) {
    const [member, setMember] = useState<Member>();

    useEffect(() => {
        const getGolfer = async () => {
            const { data, error } = await supabase.from("members").select().eq("member_Id", parseInt(props.device.golferUUID!));

            if (error) {
                console.log(error);
            }

            if (data) {
                setMember(data[0]);
            }
        }
        getGolfer();
    });

    return (
        <>
            {member ?
                <div className="golfer" onMouseEnter={() => props.setHoveredDevice(props.device)} onMouseLeave={() => props.setHoveredDevice(undefined)} onClick={() => props.handleClick(member)}>
                    <div className="color-identifier" style={{ backgroundColor: "cyan" }}>&nbsp;</div>
                    <div>
                        <h3>{member.firstName} {member.lastName}</h3>
                        <h4>ID: {member.member_Id}</h4>
                    </div>
                </div> : <></>
            }
        </>
    )
}