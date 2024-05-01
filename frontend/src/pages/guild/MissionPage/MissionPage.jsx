import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, MaterialSymbol } from '../../../components';
import { PaperLayout } from '../../_layout/components';
import { api } from '../../../api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyMissionDetail, MissionDetailBlock } from './MissionDetailBlock';
import { useSideBar } from '../../_layout/MainLayout/SideBar';
import { AddMissionModal } from '../modal';
import { HeaderButton, ManageModeHeaderButton } from './HeaderButton';
import { MissionBar } from './MissionBar';
import { formateIsoDate } from '../../../utils';
import {
  MissionTypeSelect,
  convertMissionTypeValue,
} from './MissionTypeSelect';
import { getMissionDetailBtn } from './utils';
import { useGuild, useUserMe } from '../../_layout';

export const MissionPage = ({ manageMode = false }) => {
  const params = useParams();
  useSideBar({ activeKey: ['guilds', params.gid] });
  const { userMe } = useUserMe();
  const navigate = useNavigate();
  const [missionList, setMissionList] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState();
  const { getMyMemberShipInGuild } = useGuild();

  const [query, setQuery] = useState({
    filter: 'all',
    missionType: '',
  });
  const [modalStatus, setModalStatus] = useState({
    isOpen: false,
    formData: {},
    type: 'new',
  });

  const filteredMission = useMemo(() => {
    if (!missionList?.length) return [];

    const baseFilteredMissionList = (() => {
      switch (query.filter) {
        case 'mine':
          return missionList.filter(({ creator }) => creator === userMe.id);
        case 'cancel':
          return missionList.filter(({ status }) => status === 'Cancelled');
        case 'canAccepted':
          return missionList.filter(({ status }) => status === 'Cancelled');
        case 'inProgress':
          return missionList.filter(({ status }) => status === 'In Progress');
        case 'completed':
          return missionList.filter(({ status }) => status === 'Completed');
        case 'expired':
          return missionList.filter(({ status }) => status === 'Expired');
        case 'all':
        default:
          return missionList.filter(
            ({ status }) => status !== 'Cancelled' && status !== 'Expired'
          );
      }
    })();

    if (!query.missionType) return baseFilteredMissionList;

    const { type, repetitiveTaskType } = convertMissionTypeValue(
      query.missionType
    );
    return baseFilteredMissionList.filter(
      (mission) =>
        mission.type === type &&
        mission.repetitiveTaskType === (repetitiveTaskType ?? 'None')
    );
  }, [missionList, query, userMe]);

  const fetchMissions = useCallback(async () => {
    const res = await api.guild.getGuildsTasks({
      pathParams: { gid: params.gid },
      params: { q: search },
    });
    if (res.status !== 200) return;
    const data = await res.json();
    if (!Array.isArray(data.data)) return;

    setMissionList(data.data);
    return data.data;
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

  const fetchMissionDetail = async (id) => {
    const res = await api.guild.getGuildsTasksDetail({
      pathParams: { gid: params.gid, tid: id },
    });
    const json = await res.json();
    return json.data;
  };
  const handleMissionClick = async (id) => {
    const data = await fetchMissionDetail(id);
    setSelectedDetail(data);
  };

  const handleSubmitModal = async (value) => {
    let newDataId;
    if (modalStatus.type === 'edit') {
      const data = await api.guild.putGuildsTasks({
        pathParams: { gid: params.gid, tid: selectedDetail.id },
        body: {
          ...value,
          taskId: selectedDetail.id,
          initiationTime: formateIsoDate(value.initiationTime ?? new Date()),
          deadline: formateIsoDate(value.deadline ?? new Date()),
        },
      });
      const json = await data.json();
      newDataId = json.data.id;
    } else {
      const data = await api.guild.postGuildsTasks({
        pathParams: { gid: params.gid },
        body: {
          ...value,
          initiationTime: formateIsoDate(value.initiationTime ?? new Date()),
          deadline: formateIsoDate(value.deadline ?? new Date()),
        },
      });
      const json = await data.json();
      newDataId = json.data.id;
    }
    await fetchMissions();
    const detail = await fetchMissionDetail(newDataId);
    setSelectedDetail(detail);
  };

  const handleBtnClick = async (type) => {
    if (type === 'edit') {
      setModalStatus({
        isOpen: true,
        formData: selectedDetail,
        type: 'edit',
      });
      return;
    }

    switch (type) {
      case 'accept': {
        await api.guild.getGuildsTasksAccepted({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        const data = await fetchMissionDetail(selectedDetail.id);
        setSelectedDetail(data);
        break;
      }
      case 'complete': {
        await api.guild.patchGuildsTasksComplete({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        const data = await fetchMissionDetail(selectedDetail.id);
        setSelectedDetail(data);
        break;
      }
      case 'submit': {
        await api.guild.patchGuildsTasksSubmit({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        const data = await fetchMissionDetail(selectedDetail.id);
        setSelectedDetail(data);
        break;
      }
      case 'abandon': {
        await api.guild({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        const data = await fetchMissionDetail(selectedDetail.id);
        setSelectedDetail(data);
        break;
      }
      case 'restore':
        await api.guild.patchGuildsTasksRestore({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        await fetchMissions();
        setSelectedDetail(undefined);
        break;
      case 'cancel':
        await api.guild.patchGuildsTasksCancel({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        await fetchMissions();
        setSelectedDetail(undefined);
        break;

      case 'delete':
        await api.guild.deleteGuildsTasks({
          pathParams: { gid: params.gid, tid: selectedDetail.id },
        });
        await fetchMissions();
        setSelectedDetail(undefined);
        break;
      default:
    }
  };

  const handleCheckboxClick = async (itemRecordId) => {
    await api.guild.patchTasksCheckbox({
      pathParams: { gid: params.gid },
      body: { itemRecordId },
    });
    const data = await fetchMissionDetail(selectedDetail.id);
    setSelectedDetail(data);
  };

  const enableManage =
    !manageMode &&
    ['Admin', 'Master'].includes(getMyMemberShipInGuild(params.id));

  return (
    <>
      <PaperLayout row>
        <PaperLayout.Title className="relative flex items-center justify-center">
          {manageMode && (
            <Link
              to={`/guilds/${params.gid}/missions`}
              className="absolute left-0"
            >
              <MaterialSymbol
                icon="arrow_back"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-primary-300/50"
              />
            </Link>
          )}
          {manageMode ? 'Guild Mission Manager' : 'Mission'}
          {enableManage && (
            <Button
              type="hollow"
              className="absolute right-0"
              onClick={() => navigate('./manage')}
              prefix={<MaterialSymbol icon="settings" />}
            >
              Manage
            </Button>
          )}
        </PaperLayout.Title>

        <div className="mb-4 flex w-full justify-between">
          <div className="flex w-full max-w-[400px] rounded-full border border-primary-500 p-1 text-paragraph-p2 text-primary-500">
            <MissionTypeSelect
              value={query.missionType}
              onChange={(missionType) =>
                setQuery((q) => ({ ...q, missionType }))
              }
            />
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
          {manageMode ? (
            <ManageModeHeaderButton
              {...query}
              onChange={(data) => {
                setQuery((q) => ({ ...q, ...data }));
              }}
            />
          ) : (
            <HeaderButton
              value={query.filter}
              onChange={(filter) => {
                setQuery((q) => ({ ...q, filter }));
              }}
            />
          )}
          {manageMode && (
            <Button onClick={() => setModalStatus({ isOpen: true })}>
              add mission
            </Button>
          )}
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
              onCheckItemClick={handleCheckboxClick}
              headerBtn={
                manageMode && (
                  <MaterialSymbol
                    onClick={() => {
                      setModalStatus({
                        isOpen: true,
                        formData: selectedDetail,
                      });
                    }}
                    icon="content_copy"
                    className="float-right cursor-pointer rounded-full hover:bg-primary-300/50"
                  />
                )
              }
              footerBtn={getMissionDetailBtn({
                detail: selectedDetail,
                manageMode,
                onBtnClick: handleBtnClick,
                userId: userMe.id,
              })}
            />
          ) : (
            <EmptyMissionDetail className="w-full" />
          )}
        </div>
      </PaperLayout>
      <AddMissionModal
        modalStatus={modalStatus}
        onClose={() => setModalStatus({ isOpen: false })}
        onFinish={handleSubmitModal}
      />
    </>
  );
};
