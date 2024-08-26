import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";

import { loadingState } from "../../globalStates/atoms";
import { fetchGroups, fetchMessages } from "../../apis/messages";

export const useMessagesFetch = () => {
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const setLoading = useSetRecoilState(loadingState);

  const { group_id } = useParams();

  const displayingGroup = groups.find((group) => group.id === Number(group_id));

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchInitialGroups();
      } catch (err) {
        console.log("err", err);
      } finally {
        setLoading(false);
      }
    })();
    // 別グループへのURL遷移を検知
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group_id]);

  const fetchInitialGroups = async () => {
    const groupResponse = await fetchGroups();
    setGroups(groupResponse.data);

    if (group_id) {
      const messagesResponse = await fetchMessages(group_id);
      setMessages(messagesResponse.data);
    }
  };

  return {
    groups,
    displayingGroup,
    messages,
    fetchInitialGroups,
  };
};
