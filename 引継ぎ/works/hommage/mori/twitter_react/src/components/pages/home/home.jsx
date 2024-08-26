import { memo, useCallback, useState } from "react";
import { IconContext } from "react-icons";
import { FaTwitter } from "react-icons/fa";

import { Button } from "../../atoms/Button"
import { NewAccountModal } from "../../modals/NewAccountModal";
import { LoginModal } from "../../modals/LoginModal";
import '../../../style/pages/home/Home.scss'

export const Home = memo(() => {
    const buttonClass = {
        newUser: 'newUserBtn',
        login: 'loginBtn'
    };

    const [showModalFlag, setShowModalFlag] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const onClickShowModalFlag = useCallback(() => {
        setShowModalFlag(!showModalFlag);
    }, [setShowModalFlag, showModalFlag]);

    const onClickShowLoginModal = useCallback(() => {
        setShowLoginModal(!showLoginModal);
    }, [setShowLoginModal, showLoginModal]);

    return (
        <div className="home">
            <div className="left">
                <IconContext.Provider value={{ size: '100%', color: 'rgb(29, 155, 240)' }}>
                    <FaTwitter />
                </IconContext.Provider>
            </div>
            <div className="right">
                <h1>すべての話題が、ここに。</h1>
                <h4>今すぐ参加しましょう。</h4>
                <Button className={buttonClass.newUser} onClick={onClickShowModalFlag}>アカウントを作成</Button>
                または
                <Button className={buttonClass.login} onClick={onClickShowLoginModal}>ログイン</Button>
            </div>
            <NewAccountModal showModalFlag={showModalFlag} onClickShowModalFlag={onClickShowModalFlag} />
            <LoginModal showLoginModal={showLoginModal} onClickShowLoginModal={onClickShowLoginModal} />
        </div>
    )
})