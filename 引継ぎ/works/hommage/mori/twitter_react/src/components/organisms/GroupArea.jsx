import { GroupAreaHook } from "../../hooks/organisms/GroupAreaHook";
import { Entry } from "../atoms/Entry";
import "../../style/organisms/group/GroupArea.scss"

export const GroupArea = () => {
    const { entries } = GroupAreaHook();

    return (
        <div className="group-area">
            <div className="header">
                <h4>Messages</h4>
            </div>
            <div className="groups">
                {entries.map((entry, i) => (
                    <div className="entry" key={`entry-${i}`}>
                        <Entry entry={entry} />
                    </div>
                ))}
            </div>
        </div>
    );
}