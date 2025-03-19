import { Golfer } from "../types/DatabaseTypes";

const CDNURL = "https://raehtwwdbuzfggmigybx.supabase.co/storage/v1/object/public/golfer-pictures/"

export function GolferComponent(props: { golfer: Golfer, handleGolferClick: Function }) {
    return (
        <div key={props.golfer.id} className="golfer" onClick={() => { props.handleGolferClick(props.golfer) }}>
            <img className="golfer-picture" src={CDNURL + props.golfer.pictureUrl} />
            <h3>{props.golfer.firstName} {props.golfer.lastName}</h3>
        </div>
    )
}