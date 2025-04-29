import { useState } from "react";

import { device } from "../types/types";

import "../styles/IntializeDeviceDialog.css"
import { ExpandableDeviceComponent } from "./ExpandableDeviceComponent";

export function IntializeDeviceDialog(props: { show: boolean, devices?: device[], closePopup: Function, sendInitializeCommand: Function, companyId: string }) {
    return (
        <>
            {props.show ?
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <button className="close-button" onClick={() => props.closePopup(false)}>X</button>
                        </div>
                        {props.devices ? props.devices.filter((device: device) => {
                            return device.status === "UNINITIALIZED";
                        }).map((device: device) => {
                            return (
                                <>
                                    <ExpandableDeviceComponent device={device} sendInitializeCommand={props.sendInitializeCommand} closePopup={props.closePopup} companyId={props.companyId} />
                                </>
                            )
                        }) : <></>}
                    </div>
                </div> : <></>}
        </>
    )
}