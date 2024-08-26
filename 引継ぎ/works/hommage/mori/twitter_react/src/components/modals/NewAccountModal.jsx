import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { memo } from "react";
import { InputField } from "../atoms/InputField";
import { IoArrowBack } from "react-icons/io5";

import '../../style/modal/NewAccountModal.scss'
import { Button } from '../atoms/Button';
import { useNewAccountHook } from "../../hooks/newAccountModal/useNewAccountHook";

export const NewAccountModal = memo(({ showModalFlag, onClickShowModalFlag }) => {
    const {
        account,
        onChangeAccount,
        errorMsgs,
        onClickSignup
    } = useNewAccountHook();

    if (!showModalFlag) return <></>
    return (
        <div className="overlay">
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal.Dialog>
                    <Modal.Header>
                        <IoArrowBack onClick={onClickShowModalFlag} />
                        <Modal.Title>アカウントを作成</Modal.Title>
                    </Modal.Header>
                    {errorMsgs && errorMsgs.map((errorMsg, index
                    ) => (
                        <p key={index}>{errorMsg}</p>
                    )
                    )}

                    <form className="login-form" action="">
                        <Modal.Body>
                            <InputField type='text' name='name' value={account.name} onChange={onChangeAccount} placeholder='名前' />
                            <InputField type='text' name='email' value={account.email} onChange={onChangeAccount} placeholder='Eメール' />
                            <InputField type='password' name='password' value={account.password} onChange={onChangeAccount} placeholder='パスワード' />
                            <InputField type='password' name='passwordConfirmation' value={account.passwordConfirmation} onChange={onChangeAccount} placeholder='パスワード(確認)' />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={onClickSignup}>アカウント作成</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Dialog>
            </div>
        </div>
    );
})