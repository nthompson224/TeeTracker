import { device } from "../types/types";

import "../styles/IntializeDeviceDialog.css"

export function IntializeDeviceDialog(props: { show: boolean, devices?: device[], closePopup: Function }) {
    return (
        <>
            {props.show ?
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header"><button className="close-button" onClick={() => props.closePopup(false)}>X</button></div>
                        {props.devices ? props.devices.filter((device: device) => {
                            return device.status === "UNINITIALIZED";
                        }).map((device: device) => {
                            return (
                                <div className="golfer">
                                    <img src="raspberrypi.png" />
                                    <h3>{device["name"]}</h3>
                                </div>
                            )
                        }) : <></>}
                    </div>
                </div> : <></>}
        </>
    )
}