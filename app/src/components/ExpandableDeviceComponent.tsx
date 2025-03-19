import { useState } from "react";

import { supabase } from "../lib/helper/SupabaseClient";

import { device, selectedGolfer } from "../types/types";
import { Golfer } from "../types/DatabaseTypes";

import "../styles/ExpandableDeviceComponent.css"
import { GolferComponent } from "./GolferComponent";

export function ExpandableDeviceComponent(props: { device: device, sendInitializeCommand: Function, closePopup: Function }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [golfers, setGolfers] = useState<Golfer[]>([]);
    const [selectedGolfer, setSelectedGolfer] = useState<Golfer | null>(null);

    async function queryGolfers() {
        const name = (document.getElementById("name") as HTMLInputElement).value;

        if (name === "") {
            setGolfers([]);
            return;
        }

        const { data, error } = await supabase.from("golfers").select().or(`firstName.ilike.${name}%,lastName.ilike.${name}%`);

        if (error) {
            console.log(error);
        }
        console.log(data);

        if (data) {
            setGolfers(data);
        } else {
            setGolfers([]);
        }
    }

    function closeExpandableDeviceComponent() {
        setIsExpanded(false);
        setGolfers([]);
        setSelectedGolfer(null);
    }

    function handleGolferClick(golfer: Golfer) {
        setSelectedGolfer(golfer);

        (document.getElementById("name") as HTMLInputElement).value = golfer.firstName + " " + golfer.lastName;

        setGolfers([]);
    }

    function sendInitializeCommand() {
        if (!selectedGolfer) {
            alert("Please select a golfer");
            return;
        }

        let golfer: selectedGolfer = {
            uuid: selectedGolfer.id,
            name: selectedGolfer.firstName + " " + selectedGolfer.lastName
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
                            <input id="name" placeholder="" onChange={queryGolfers} />
                            <div className="label">
                                <label htmlFor="name">Golfer Name</label>
                            </div>
                        </div>
                        {golfers.length > 0 ?
                            <div className="autocomplete">
                                {golfers.map((golfer) => {
                                    return (
                                        <GolferComponent golfer={golfer} handleGolferClick={handleGolferClick} />
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