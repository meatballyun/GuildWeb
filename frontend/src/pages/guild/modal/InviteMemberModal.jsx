import { useEffect, useMemo, useState } from 'react';
import { Input, Loading, MaterialSymbol } from '../../../components';
import { Modal } from '../../../components/Modal';
import { api } from '../../../api';
import { UserItem } from '../components';

export const InviteMemberModal = ({ onClose, guildMemberList, ...props }) => {
  const [friendList, setFriendList] = useState();
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  const filteredFriendList = useMemo(() => {
    const guildMemberIdList = guildMemberList?.map(({ id }) => id) ?? [];
    return friendList?.filter(({ id }) => !guildMemberIdList.includes(id));
  }, [friendList, guildMemberList]);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      const res = await api.user.getUserFriend({ params: { q: search } });
      const { data } = await res.json();
      setIsFetched(true);
      setFriendList(data);
    })();
  }, [search]);

  return (
    <Modal {...props} onClose={onClose} header="Invite Your Friend To Join">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="flex w-full rounded-md border border-primary-500 py-1 pl-3 pr-2 text-paragraph-p2 text-primary-500">
          <Input
            value={search}
            onChange={setSearch}
            className="w-full"
            placeholder="Search with User name..."
          />
          <MaterialSymbol icon="search" size={24} />
        </div>

        {(() => {
          if (!isFetched)
            return (
              <div className="flex h-[240px] items-center justify-center text-heading-h5 text-primary-300">
                <Loading />
              </div>
            );
          if (!filteredFriendList?.length)
            return (
              <div className="flex h-[240px] items-center justify-center text-heading-h5 text-primary-300">
                沒有可邀請ㄉ朋朋
              </div>
            );
          return (
            <div className="mt-2 flex w-full flex-1 flex-grow flex-col gap-2 overflow-auto  bg-primary-200 p-2">
              {filteredFriendList.map((foodItem, i) => (
                <UserItem
                  {...foodItem}
                  key={i}
                  onClick={() => onClose(foodItem)}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
