import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { memo } from 'react';
import Modal from 'react-bootstrap/Modal';
import { IoArrowBack } from "react-icons/io5";

import { InputField } from "../atoms/InputField";
import { Button } from '../atoms/Button';
import { ProfileEditModalHook } from '../../hooks/modal/ProfileEditModalHook';
import "../../style/modal/ProfileEditModal.scss";

export const ProfileEditModal = memo(({ showProfileEditModal, setShowProfileEditModal }) => {
    const {
        newProfile,
        setNewProfile,
        editProfile,
        onChangeNewProfile,
        selectHeaderImage,
        selectProfileImage
    } = ProfileEditModalHook(showProfileEditModal, setShowProfileEditModal);


    if (!showProfileEditModal) return <></>;
    return (
        <div className="overlay">
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal.Dialog>
                    <Modal.Header>
                        <IoArrowBack className='arrow' onClick={() => setShowProfileEditModal(!showProfileEditModal)} />
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>

                    <form className="edit-profile-form" action="">
                        <Modal.Body>
                            <InputField
                                type='text'
                                name='name'
                                value={newProfile.name}
                                placeholder='Name'
                                onChange={onChangeNewProfile}
                            />
                            <InputField
                                type='text'
                                name='bio'
                                value={newProfile.bio}
                                placeholder='Bio'
                                onChange={onChangeNewProfile}
                            />
                            <InputField
                                type='text'
                                name='birthday'
                                value={newProfile.birthday}
                                placeholder='Birthday'
                                onChange={(e) => setNewProfile({
                                    ...newProfile,
                                    'birthday': e.target.value
                                })}
                            />
                            <InputField
                                type='text'
                                name='location'
                                value={newProfile.location}
                                placeholder='Locaiton'
                                onChange={onChangeNewProfile}
                            />
                            <InputField
                                type='text'
                                name='website'
                                value={newProfile.website}
                                placeholder='Website'
                                onChange={onChangeNewProfile}
                            />
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Header Image</Form.Label>
                                <Form.Control type="file" onChange={selectHeaderImage} />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Profile Image</Form.Label>
                                <Form.Control type="file"
                                    onChange={selectProfileImage}
                                />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={editProfile}>Edit profile</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Dialog>
            </div>
        </div>
    );
})