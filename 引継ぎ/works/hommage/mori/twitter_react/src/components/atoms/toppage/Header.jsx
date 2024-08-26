import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { FaTwitter } from "react-icons/fa";

import "../../../style/atoms/toppage/Header.scss";

export const Header = () => {
    return (
        <header>
            <Link to="/toppage">
                <IconContext.Provider value={{ size: '30px', color: 'rgb(29, 155, 240)' }}>
                    <FaTwitter />
                    <h4>Twitter Clone</h4>
                </IconContext.Provider>
            </Link>
        </header>
    )
}