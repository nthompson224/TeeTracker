import { Member } from "../types/DatabaseTypes";

const CDNURL = "https://raehtwwdbuzfggmigybx.supabase.co/storage/v1/object/public/golfer-pictures/"

export function GolferComponent(props: { member: Member, handleGolferClick: Function }) {
    return (
        <div key={props.member.member_Id} className="golfer" onClick={() => props.handleGolferClick(props.member)}>
            <div>
                <h3>{props.member.firstName} {props.member.lastName}</h3>
                <h4>ID: {props.member.member_Id}</h4>
            </div>
        </div>
    )
}