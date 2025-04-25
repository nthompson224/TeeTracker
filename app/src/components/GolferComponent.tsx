import { Golfer } from "../types/DatabaseTypes";

const CDNURL = "https://raehtwwdbuzfggmigybx.supabase.co/storage/v1/object/public/golfer-pictures/"

export function GolferComponent(props: { golfer: Golfer, handleGolferClick: Function }) {
    return (
        <div key={props.golfer.Id} className="golfer" onClick={() => { console.log(CDNURL + props.golfer.pictureUrl) }}>
            <img className="golfer-picture" src={CDNURL + props.golfer.pictureUrl} />
            <div>
                <h3>{props.golfer.firstName} {props.golfer.lastName}</h3>
                <h4>ID: {props.golfer.Id}</h4>
            </div>
        </div>
    )
}