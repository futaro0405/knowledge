import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { FormArea } from "../molecules/FormArea";
import { TweetContentsArea } from "../molecules/TweetContentsArea"


export const TweetArea = () => {
    return (
        <>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="home" title="For You" />
                <Tab eventKey="profile" title="Following" />
            </Tabs>
            <FormArea />
            <TweetContentsArea />
        </>
    );
}