import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { device } from "../types/types";

export function PoiMarkers(props: { devices: device[], hoveredDevice?: device, color: string }) {
    return (
        <>
            {props.devices.map((device: device) => {
                if (device.location) {
                    return (
                        <AdvancedMarker
                            position={device.location.coordinates}>
                            {props.hoveredDevice && device.id === props.hoveredDevice.id ?
                                <>
                                    <div></div>
                                    <div className="marker" style={{ width: "40px", height: "40px", backgroundColor: "#fff" }}></div>
                                </> : <div className="marker" style={{ backgroundColor: props.color }}></div>}
                        </AdvancedMarker>
                    )
                } else {
                    return <></>
                }

            })}
        </>
    );
}