import { device } from "../types/types";

import "../styles/IntializeDeviceDialog.css"

export function IntializeDeviceDialog(props: { show: boolean, devices?: device[], closePopup: Function }) {
    return (
        <>
            {props.show ?
                <div className="popup">
                    <div className="content">
                        {props.devices ? props.devices.filter((device: device) => {
                            return device.status === "UNINITIALIZED";
                        }).map((device: device) => {
                            return (
                                <div className="golfer">
                                    <img src="logo512.png" />
                                    <h3>{device["name"]}</h3>
                                </div>
                            )
                        }) : <></>}
                        <button onClick={() => props.closePopup(false)}>close</button>
                    </div>
                </div> : <></>}
        </>
    )
}