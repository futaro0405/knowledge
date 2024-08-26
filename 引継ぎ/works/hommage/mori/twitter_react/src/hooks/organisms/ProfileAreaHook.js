import { useCallback, useContext, useEffect, useState } from "react"
import { AxiosInstance } from "../../axios/axiosInstance"
import { useLocation, useNavigate } from "react-router-dom";
import { CookieContext } from "../../providers/TwitterProvider";
import { AuthHook } from "../auth/authHook";

export const ProfileAreaHook = (showProfileEditModal) => {
    const { instance } = AxiosInstance();
    const [currentUserData, setCurrentUserData] = useState(
        JSON.parse(sessionStorage.getItem('currentUserData'))
    );
    const { cookies } = useContext(CookieContext);
    const { currentUser } = AuthHook();
    const navigate = useNavigate();
    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const userId = pathArray[pathArray.length - 1];
    const [profile, setProfile] = useState({
        user: {
            name: '',
            tweets: [
                {
                    content: ''
                }
            ],
            following: [],
            followers: [],
        },
        is_group: false,
        group_id: 0
    });

    // クエリパラメータをtabのデフォルトキーに設定
    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const defaultTab = (query.get('tab') === null) ? 'posts' : query.get('tab');

    const [selectTab, setSelectTab] = useState(defaultTab);

    const [profileTweets, setProfileTweets] = useState([]);
    const [profileComments, setProfileComments] = useState([]);
    const [profileRetweet, setProfileRetweet] = useState([
        [
            {
                content: ''
            }
        ],
        [
            {
                name: ''
            }
        ]
    ]);
    const [profileFavorite, setProfileFavorite] = useState([
        [
            {
                content: ''
            }
        ],
        [
            {
                name: ''
            }
        ]
    ]);

    // follow関連
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const getUserProfile = useCallback(async () => {
        try {
            const profileData = await instance.get(`/api/v1/users/${userId}`);
            setProfile(profileData.data);
            setProfileTweets([...profileData.data.user.tweets].reverse());
            setProfileComments([...profileData.data.user.comments].reverse());
            setProfileRetweet(profileData.data.user.retweet_tweet);
            setProfileFavorite(profileData.data.user.nice_tweet);
            setFollowing(profileData.data.user.following);
            setFollowers(profileData.data.user.followers);
        } catch (error) {
            console.log(error);
        }
    }, [instance, userId])

    const doGetUserProfile = useCallback(async () => {
        await getUserProfile();
    }, [getUserProfile]);

    const onSelectTab = useCallback((tab) => {
        setSelectTab(tab);
        navigate(`/profile/${profile.user.id}?tab=${tab}`);
    }, [navigate, profile.user.id])

    const getCurrentUser = useCallback(async () => {
        return await currentUser(cookies);
    }, [cookies, currentUser])

    const onClickFollow = useCallback(async () => {
        try {
            await instance.post(`/api/v1/users/${profile.user.id}/follow`);
            // フォロー後にプロフィール画面とsessionStorageを更新
            const currentUser = await getCurrentUser();
            setCurrentUserData(currentUser.data);
            sessionStorage.setItem('currentUserData', JSON.stringify(currentUser.data));
            doGetUserProfile();
        } catch (error) {
            console.log(error);
        }
    }, [profile.user.id])

    const onClickUnFollow = useCallback(async () => {
        try {
            await instance.delete(`/api/v1/users/${profile.user.id}/unfollow`);
            // フォロー後にプロフィール画面とsessionStorageを更新
            const currentUser = await getCurrentUser();
            setCurrentUserData(currentUser.data);
            sessionStorage.setItem('currentUserData', JSON.stringify(currentUser.data));
            doGetUserProfile();
        } catch (error) {
            console.log(error);
        }
    }, [profile.user.id])

    const moveGroupArea = useCallback(async () => {
        if (!profile.is_group) {
            const makeEntry = await instance.post('/api/v1/groups', {
                user_id: profile.user.id
            });
            navigate(`/groups/${makeEntry.data.another_entry.group_id}`);
        } else {
            navigate(`/groups/${profile.group_id}`);
        }
    }, [profile])

    useEffect(() => {
        doGetUserProfile();
    }, [showProfileEditModal])

    return {
        currentUserData,
        navigate,
        profile,
        profileTweets,
        userId,
        selectTab,
        profileComments,
        defaultTab,
        onSelectTab,
        profileRetweet,
        profileFavorite,
        following,
        followers,
        onClickFollow,
        onClickUnFollow,
        moveGroupArea,
    };
}