import { useCallback, useContext, useState } from "react";
import { CookieContext } from "../../providers/TwitterProvider";
import { AxiosInstance } from "../../axios/axiosInstance";
import { AuthHook } from '../../hooks/auth/authHook';

export const ProfileEditModalHook = (showProfileEditModal, setShowProfileEditModal) => {
    const { instance } = AxiosInstance();
    const { cookies } = useContext(CookieContext);
    const { currentUser } = AuthHook();
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));
    const [newProfile, setNewProfile] = useState({
        name: currentUserData.data.name,
        bio: currentUserData.data.bio,
        birthday: currentUserData.data.birthday,
        location: currentUserData.data.location,
        website: currentUserData.data.website
    });

    const editProfile = useCallback(async (e) => {
        try {
            e.preventDefault();
            const resEditProfile = await instance.put(
                '/api/v1/profile',
                {
                    user: newProfile
                }
            );
            console.log(resEditProfile);
            const newCurrentUserData = await currentUser(cookies);
            sessionStorage.setItem('currentUserData', JSON.stringify(newCurrentUserData.data));
            setShowProfileEditModal(!showProfileEditModal);
        } catch (error) {
            console.log(error);
        }
    }, [instance, newProfile, setShowProfileEditModal, showProfileEditModal])

    const onChangeNewProfile = (e) => {
        const { name, value } = e.target
        setNewProfile({ ...newProfile, [name]: value })
    }

    const fileRead = async (file) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        await new Promise((resolve) => (fileReader.onload = () => resolve()));
        return fileReader.result;
    };

    const fileInput = async (event) => {
        if (event.target.files.length > 0) {
            for (const file of event.target.files) {
                const fileData = await fileRead(file);
                const fileName = file.name;
                return { fileData, fileName };
            }
        }
    }

    const selectHeaderImage = async (e) => {
        const { fileData, fileName } = await fileInput(e);
        setNewProfile({ ...newProfile, headerImageData: fileData, headerFileName: fileName });
    }

    const selectProfileImage = async (e) => {
        const { fileData, fileName } = await fileInput(e);
        setNewProfile({ ...newProfile, profileImageData: fileData, profileFileName: fileName });
    }

    return {
        newProfile,
        setNewProfile,
        editProfile,
        onChangeNewProfile,
        selectHeaderImage,
        selectProfileImage
    };
}