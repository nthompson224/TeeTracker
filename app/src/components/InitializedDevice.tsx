import { useEffect, useState } from "react";

import { FiEdit } from 'react-icons/fi';

import { device, golfer } from "../types/types";
import { supabase } from "../lib/helper/SupabaseClient";

const CDNURL = "https://raehtwwdbuzfggmigybx.supabase.co/storage/v1/object/public/golfer-pictures/"

export function InitializedDevice(props: { device: device, setHoveredDevice: Function }) {
    const [golfer, setGolfer] = useState<golfer>();

    useEffect(() => {
        const getGolfer = async () => {
            const { data, error } = await supabase.from("golfers").select().eq("id", props.device.golferUUID!);

            if (error) {
                console.log(error);
            }

            if (data) {
                let golferData: golfer = {
                    uuid: data[0].id,
                    name: data[0].firstName + " " + data[0].lastName,
                    pictureUrl: data[0].pictureUrl!
                };

                setGolfer(golferData);
            }
        }
        getGolfer();
    });

    return (
        <>
            {golfer ?
                <div className="golfer" onMouseEnter={() => props.setHoveredDevice(props.device)} onMouseLeave={() => props.setHoveredDevice(undefined)}>
                    <div className="color-identifier" style={{ backgroundColor: "cyan" }}>&nbsp;</div>
                    <img src={CDNURL + golfer?.pictureUrl} />
                    <h3>{golfer?.name}</h3>
                </div> : <></>
            }
        </>
    )
}