import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';

import { memo } from "react";
import { IoArrowBack } from "react-icons/io5";

import '../../style/modal/LoginModal.scss'
import { InputField } from "../atoms/InputField";
import { Button } from '../atoms/Button';
import { useLoginHook } from "../../hooks/modal/useLoginHook";


export const LoginModal = memo(({ showLoginModal, onClickShowLoginModal }) => {
    const { loginAccount, errorMsgs, onChangeLoginAccount, onClickLogin } = useLoginHook();

    if (!showLoginModal) return <></>
    return (
        <div className="overlay">
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal.Dialog>
                    <Modal.Header>
                        <IoArrowBack onClick={onClickShowLoginModal} />
                        <Modal.Title>ログイン</Modal.Title>
                    </Modal.Header>
                    {errorMsgs && errorMsgs.map((errorMsg, index
                    ) => (
                        <p key={index}>{errorMsg}</p>
                    )
                    )}

                    <form className="login-form" action="">
                        <Modal.Body>
                            <InputField type='text' name='email' value={loginAccount.email} onChange={onChangeLoginAccount} placeholder='Eメール' />
                            <InputField type='password' name='password' value={loginAccount.password} onChange={onChangeLoginAccount} placeholder='パスワード' />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={onClickLogin}>ログイン</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Dialog>
            </div>
        </div>
    );
})