import { InputField } from "../../atoms/InputField";
import { Button } from "../../atoms/Button";
import "../../../style/atoms/toppage/RightSidebar.scss"

export const RightSidebar = () => {
    return (
        <>
            <InputField placeholder="Search">
            </InputField>
            <div className="subscribe-area">
                <h4>Subscribe to Premium</h4>
                <p>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
                <Button>Subscribe</Button>
            </div>
            <div className="happening-area">
                <h4>What's happening</h4>
                <p>Sports</p>
                <p>Program</p>
                <p>React</p>
                <p>Ruby on Rails</p>
            </div>
            <div className="who-to-follow">
                <h4>Who to follow</h4>
                <p>Follower1</p>
                <p>Follower2</p>
                <p>Follower3</p>
            </div>
        </>
    );
}