import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { device } from "../types/types";

export function PoiMarkers(props: { devices: device[] }) {
    return (
        <>
            {props.devices.map((device: device) => {
                if (device.location) {
                    return (
                        <AdvancedMarker
                            position={device.location.coordinates}>
                            <div className="marker" />
                        </AdvancedMarker>
                    )
                } else {
                    return <></>
                }

            })}
        </>
    );
}