import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, MaterialSymbol } from '../../../components';
import { Paper } from '../../_layout/components';
import { api } from '../../../api';
import { Link, useParams } from 'react-router-dom';
import { EmptyMissionDetail, MissionDetailBlock } from './MissionDetailBlock';
import { useSideBar } from '../../_layout/MainLayout/SideBar';
import { AddMissionModal } from '../modal';
import { HeaderButton } from './HeaderButton';
import { MissionBar } from './MissionBar';
import { formateDate } from '../../../utils';

export const MissionPage = ({ manageMode = false }) => {
  const params = useParams();
  useSideBar({ activeKey: ['guild', params.gid] });

  const [openModal, setOpenModal] = useState();

  const [missionList, setMissionList] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState();
  const [filterType, setFilterType] = useState();

  const filteredMission = useMemo(() => {
    if (!missionList?.length) return [];
    switch (filterType) {
      case 'canAccepted':
        return missionList.filter(({ status }) => status !== 'Cancel');
      case 'inProcess':
        return missionList.filter(({ status }) => status === 'In Process');
      case 'completed':
        return missionList.filter(({ status }) => status === 'Completed');
      case 'expired':
        return missionList.filter(({ status }) => status === 'Expired');
      case 'all':
      default:
        return missionList.filter(({ status }) => status !== 'Cancel');
    }
  }, [missionList, filterType]);

  const fetchMissions = useCallback(async () => {
    const res = await api.guild.getTasks({
      pathParams: { gid: params.gid },
      params: { q: search },
    });
    if (res.status !== 200) return;
    const data = await res.json();
    if (!Array.isArray(data.data)) return;

    setMissionList(data.data);
  }, [params.gid, search]);

  useEffect(() => {
    setSelectedDetail();
  }, [search, manageMode]);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchMissions();
      setIsFetched(true);
    })();
  }, [fetchMissions]);

  const handleMissionClick = async (id) => {
    const res = await api.guild.getTaskDetail({
      pathParams: { gid: params.gid, tid: id },
    });
    const json = await res.json();
    setSelectedDetail(json.data);
  };

  const handleSubmitModal = async (value) => {
    api.guild.createTask({
      pathParams: { gid: params.gid },
      body: {
        ...value,
        initiationTime: formateDate(value.initiationTime ?? new Date()),
        deadline: formateDate(value.deadline ?? new Date()),
      },
    });
  };

  return (
    <>
      <Paper row className="flex flex-col">
        <div className="mb-4 text-center text-heading-h1 text-primary-500">
          {!manageMode && (
            <Link to=".." className="float-left">
              <MaterialSymbol
                icon="arrow_back"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-primary-300/50"
              />
            </Link>
          )}
          {manageMode ? 'Mission' : 'Guild Mission Manager'}
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
          <div />
        </div>
        <div className="mb-4 flex justify-between">
          <HeaderButton value={filterType} onChange={setFilterType} />
          <Button onClick={() => setOpenModal(true)}>add mission</Button>
        </div>
        <div className="flex h-full w-full overflow-auto">
          <div className="mr-4 flex w-full flex-col gap-2 overflow-auto">
            {(() => {
              if (!isFetched) return 'loading';
              if (!filteredMission?.length) return 'noData';
              return filteredMission.map(({ id, ...data }) => (
                <MissionBar
                  onClick={() => handleMissionClick(id)}
                  key={id}
                  focus={selectedDetail?.id === id}
                  {...data}
                />
              ));
            })()}
          </div>
          {selectedDetail ? (
            <MissionDetailBlock
              key={selectedDetail.id}
              detail={selectedDetail}
              className="w-full"
              onBtnClick={(type) => {
                switch (type) {
                  case 'accept':
                    return api.guild.acceptedTask({
                      pathParams: { gid: params.gid, tid: selectedDetail.id },
                    });
                  case 'exit':
                    return api.guild.acceptedTask({});
                  default:
                }
              }}
            />
          ) : (
            <EmptyMissionDetail className="w-full" />
          )}
        </div>
      </Paper>
      <AddMissionModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onFinish={handleSubmitModal}
      />
    </>
  );
};
