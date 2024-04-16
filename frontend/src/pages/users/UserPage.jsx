import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, MaterialSymbol } from '../../components';
import { Paper } from '../_layout/components';
import { api } from '../../api';
import { Link } from 'react-router-dom';
import { UserItem } from './UserItem';
import { UserDetailBlock } from './UserDetailBlock';
import { useSideBar } from '../_layout/MainLayout/SideBar';

export const UsersPage = ({ friendsMode = false }) => {
  useSideBar({ activeKey: 'friends' });
  const [friendList, setFriendList] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [selected, setSelected] = useState();

  const fetchData = useCallback(async () => {
    const fetchFriendData = async () => {
      const res = await api.auth.getUserFriend({ params: { q: search } });
      if (res.status !== 200) return;
      const data = await res.json();
      return data.data.map((friend) => ({ ...friend, status: 'Confirmed' }));
    };

    const fetchUserData = async () => {
      const res = await api.auth.getUser({ params: { q: search } });
      if (res.status !== 200) return;
      const data = await res.json();
      return data.data;
    };

    const data = await (friendsMode ? fetchFriendData() : fetchUserData());
    setFriendList(data);
  }, [search, friendsMode]);

  const selectedDetail = useMemo(
    () => friendList?.find(({ id }) => id === selected),
    [friendList, selected]
  );
  useEffect(() => {
    setSelected();
  }, [search, friendsMode]);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchData();
      setIsFetched(true);
    })();
  }, [fetchData]);

  return (
    <Paper row className="flex flex-col">
      <div className="mb-4 text-center text-heading-h1 text-primary-500">
        {!friendsMode && (
          <Link to="/friends" className="float-left">
            <MaterialSymbol
              icon="arrow_back"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-primary-300/50"
            />
          </Link>
        )}
        {friendsMode ? 'Friends List' : 'Users List'}
      </div>

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
      <div className="flex h-full w-full overflow-auto">
        <div className="mr-4 flex w-full flex-col gap-2 overflow-auto">
          {(() => {
            if (!isFetched) return 'loading';
            if (!friendList?.length) return 'noData';
            return friendList.map(({ id, ...data }) => (
              <UserItem
                onClick={() => setSelected(id)}
                key={id}
                focus={selected === id}
                {...data}
              />
            ));
          })()}
        </div>
        {selectedDetail && (
          <UserDetailBlock
            detail={selectedDetail}
            className="max-h-full min-w-[400px]"
          />
        )}
      </div>
    </Paper>
  );
};
