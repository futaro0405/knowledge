import { IconContext } from "react-icons";
import { BsPerson } from "react-icons/bs";


import '../../../style/atoms/toppage/Sidebar.scss'
import { Button } from "../Button";
import { Link } from "react-router-dom";
import { SidebarHook } from "../../../hooks/atoms/SidebarHook";

export const Sidebar = ({ currentUserData }) => {
    const { ITEM_LIST, onClickWithdrawal } = SidebarHook();

    return (
        <aside>
            {ITEM_LIST.map((item, i) => {
                return (
                    <div key={i} className="sidebar-menu">
                        <IconContext.Provider value={{ size: '1.4rem' }}>
                            {item.icon}
                            {(item.label === 'Home') ? (
                                <Link to='/toppage'><p>{item.label}</p></Link>
                            ) : (item.label === 'Profile') ? (
                                <Link to={`/profile/${currentUserData.data.id}`}><p>{item.label}</p></Link>
                            ) : (item.label === 'Notification') ? (
                                <Link to='/notifications'><p>{item.label}</p></Link>
                            ) : (item.label === 'Message') ? (
                                <Link to='/groups'><p>{item.label}</p></Link>
                            ) : (item.label === 'Bookmarks') ? (
                                <Link to='/bookmarks'><p>{item.label}</p></Link>
                            ) : (item.label === 'Withdrawal') ? (
                                <p className="withdrawal" onClick={onClickWithdrawal}>{item.label}</p>
                            ) : (<Link to={`/${item.label}`}><p>{item.label}</p></Link >
                            )}
                        </IconContext.Provider>
                    </div>
                );
            })}
            <Button>Post</Button>
            <div className="name-area">
                <IconContext.Provider value={{ size: '1.4rem' }}>
                    <BsPerson />
                    <p>{currentUserData.data.name}</p>
                </IconContext.Provider>
            </div>
        </aside>
    )
}