import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Loading, MaterialSymbol } from '../../components';
import { PaperLayout } from '../_layout/components';
import { api } from '../../api';
import { Link } from 'react-router-dom';
import { UserItem } from './UserItem';
import { UserButtonType, UserDetailBlock } from './UserDetailBlock';
import { useSideBar } from '../_layout/MainLayout/SideBar';
import { User } from '../../api/user/interface';

export const UsersPage = ({ friendsMode = false }) => {
  useSideBar({ activeKey: 'friends' });
  const [friendList, setFriendList] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [selected, setSelected] = useState<number>();

  const fetchData = useCallback(async () => {
    const fetchFriendData = async () => {
      const data = await api.user.getUserFriend({ params: { q: search } });
      return data.map((friend) => ({
        ...friend,
        status: 'confirmed' as const,
      }));
    };

    const fetchUserData = async () => {
      const data = await api.user.getUser({ params: { q: search } });
      return data;
    };

    const data = await (friendsMode ? fetchFriendData() : fetchUserData());
    setFriendList(data);
  }, [search, friendsMode]);

  const selectedDetail = useMemo(
    () => friendList?.find(({ id }) => id === selected),
    [friendList, selected]
  );

  const handleBtnClick = async ({
    type,
    id,
  }: {
    type: UserButtonType;
    id: number;
  }) => {
    switch (type) {
      case UserButtonType.REMOVE:
      case UserButtonType.REVOKE:
      case UserButtonType.REJECT:
        await api.user.deleteUserFriend({ pathParams: { id } });
        break;
      case UserButtonType.CONFIRMED:
        await api.user.putUserFriendStatus({
          pathParams: { uid: id },
          data: { status: 'confirmed' },
        });
        break;
      default:
        await api.user.postUserFriend({ data: { uid: id } });
    }
    fetchData();
  };

  useEffect(() => {
    setSelected(undefined);
  }, [search, friendsMode]);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchData().catch(() => {});
      setIsFetched(true);
    })();
  }, [fetchData]);

  return (
    <PaperLayout>
      <PaperLayout.Title>
        {friendsMode ? (
          'Friends List'
        ) : (
          <>
            <Link to="/friends" className="float-left">
              <MaterialSymbol
                icon="arrow_back"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-primary-300/50"
              />
            </Link>
            Users List
          </>
        )}
      </PaperLayout.Title>
      <div className="mb-4 flex w-full justify-between">
        <div className="flex w-full max-w-72 rounded-full border border-primary-500 py-1 pl-3 pr-2 text-paragraph-p2 text-primary-500">
          <Input
            noFill
            value={search}
            onChange={setSearch}
            className="w-full"
            placeholder={`Search with user name...`}
          />
          <MaterialSymbol icon="search" size={24} />
        </div>

        {friendsMode ? (
          <Link to="/users">
            <Button size="sm" type="hollow" className="!rounded-full">
              Find New Friends
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
      <PaperLayout.Content>
        {(() => {
          if (!isFetched) return <Loading />;
          if (search && !friendList?.length)
            return (
              <div className="text-center text-3xl text-primary-300">
                哩沒有這個名字ㄟ冰友ㄡ，看看喜姆洗打錯字ㄌ
              </div>
            );
          if (!friendList?.length)
            return (
              <div className="text-center text-3xl text-primary-300">
                {`You have no friends in your list yet. :(`}
                <br />
                Hurry up and invite your friends to join!
              </div>
            );
          return (
            <div className="flex h-full w-full overflow-auto">
              <div className="mr-4 flex w-full flex-col gap-2 overflow-auto">
                {friendList.map(({ id, ...data }) => (
                  <UserItem
                    key={id}
                    onClick={() => setSelected(id)}
                    focus={selected === id}
                    id={id}
                    {...data}
                  />
                ))}
              </div>
              {selectedDetail && (
                <UserDetailBlock
                  onButtonClick={(type) =>
                    handleBtnClick({ id: selectedDetail.id, type })
                  }
                  detail={selectedDetail}
                  className="max-h-full min-w-[400px]"
                />
              )}
            </div>
          );
        })()}
      </PaperLayout.Content>
    </PaperLayout>
  );
};
