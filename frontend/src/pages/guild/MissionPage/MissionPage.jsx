import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Loading, MaterialSymbol } from '../../../components';
import { PaperLayout } from '../../_layout/components';
import { api } from '../../../api';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { EmptyMissionDetail, MissionDetailBlock } from './MissionDetailBlock';
import { useSideBar } from '../../_layout/MainLayout/SideBar';
import { AddMissionModal } from '../modal';
import { HeaderButton, ManageModeHeaderButton } from './HeaderButton';
import { MissionBar } from './MissionBar';
import { getMissionDetailBtn, handleEditTasksFinish } from './utils';
import { useGuild, useUserMe } from '../../_layout';

/**
 *
 * @param {{mode:"manage" | "template"}} param
 * @returns
 */
export const MissionPage = ({ mode }) => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

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
    missionType: [],
    missionStatus: [],
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
        case 'accepted':
          return missionList.filter(
            ({ isAccepted, status }) => isAccepted && status === 'Established'
          );
        case 'inProgress':
          return missionList.filter(
            ({ status, isAccepted }) => isAccepted && status === 'In Progress'
          );
        case 'completed':
          return missionList.filter(
            ({ status, isAccepted }) => isAccepted && status === 'Completed'
          );
        case 'expired':
          return missionList.filter(
            ({ status, isAccepted }) => isAccepted && status === 'Expired'
          );
        case 'all':
        default:
          if (!mode)
            return missionList.filter(({ status }) => status !== 'Cancelled');
          return missionList;
      }
    })();

    return baseFilteredMissionList.filter(({ type, status }) => {
      const isCurrentType =
        !query.missionType?.length || query.missionType.includes(type);
      const isCurrentStatus =
        !query.missionStatus?.length || query.missionStatus.includes(status);
      return isCurrentType && isCurrentStatus;
    });
  }, [missionList, mode, query, userMe]);

  const fetchMissions = useCallback(async () => {
    const res =
      mode === 'template'
        ? await api.guild.getTemplate({
            pathParams: { gid: params.gid },
            params: { q: search },
          })
        : await api.guild.getGuildsTasks({
            pathParams: { gid: params.gid },
            params: { q: search },
          });
    if (res.status !== 200) return;
    const data = await res.json();
    if (!Array.isArray(data.data)) return;

    setMissionList(data.data);
    return data.data;
  }, [mode, params.gid, search]);

  useEffect(() => {
    setSelectedDetail();
  }, [search, mode]);

  useEffect(() => {
    (async () => {
      setIsFetched(false);
      await fetchMissions();
      setIsFetched(true);
    })();
  }, [fetchMissions]);

  const focusMissionId = useMemo(() => {
    const id = searchParams.get('focus-mission-id');
    if (!id) return null;
    return +id;
  }, [searchParams]);

  const fetchMissionDetail = useCallback(async () => {
    if (!focusMissionId) return;
    const res =
      mode === 'template'
        ? await api.guild.getTemplateDetail({
            pathParams: { gid: params.gid, ttid: focusMissionId },
          })
        : await api.guild.getGuildsTasksDetail({
            pathParams: { gid: params.gid, tid: focusMissionId },
          });
    if (res.status !== 200) return;
    const json = await res.json();
    return json.data;
  }, [focusMissionId, mode, params.gid]);

  useEffect(() => {
    (async () => {
      const data = await fetchMissionDetail();
      if (data) setSelectedDetail(data);
    })();
  }, [fetchMissionDetail]);

  const handleMissionClick = (id) =>
    setSearchParams({ 'focus-mission-id': id });

  const handleSubmitModal = async (value) => {
    const newDataId = await handleEditTasksFinish({
      type: modalStatus.type,
      mode,
      gid: params.gid,
      selectedId: focusMissionId,
      value,
    });
    if (!newDataId) return;
    await fetchMissions();
    const detail = await fetchMissionDetail(newDataId);
    setSelectedDetail(detail);
  };

  const handleBtnClick = async (type) => {
    switch (type) {
      case 'edit':
        setModalStatus({
          isOpen: true,
          formData: selectedDetail,
          type: 'edit',
        });
        break;

      case 'accept': {
        await api.guild.getGuildsTasksAccepted({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case 'complete': {
        await api.guild.patchGuildsTasksComplete({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case 'submit': {
        await api.guild.patchGuildsTasksSubmit({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case 'abandon': {
        await api.guild.getGuildsTasksAbandon({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case 'restore':
        await api.guild.patchGuildsTasksRestore({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        await fetchMissions();
        setSelectedDetail(undefined);
        break;

      case 'cancel': {
        await api.guild.patchGuildsTasksCancel({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        await fetchMissions();
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case 'disable':
      case 'enable': {
        await api.guild.putTemplate({
          pathParams: { gid: params.gid, ttid: focusMissionId },
          body: { ...selectedDetail, enabled: !selectedDetail.enabled },
        });
        await fetchMissions();
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case 'delete':
        await api.guild.deleteGuildsTasks({
          pathParams: { gid: params.gid, tid: focusMissionId },
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
    const data = await fetchMissionDetail();
    setSelectedDetail(data);
  };

  const myMemberShip = getMyMemberShipInGuild(+params.gid);
  const enableManage = !mode && ['Vice', 'Master'].includes(myMemberShip);

  return (
    <>
      <PaperLayout row>
        <PaperLayout.Title className="relative flex items-center justify-center">
          {mode && (
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
          {mode ? 'Guild Mission Manager' : 'Mission'}
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

        <div className="relative mb-4 flex w-full justify-between gap-2 whitespace-nowrap">
          <div className="flex min-w-[200px] max-w-[400px] rounded-full border border-primary-500 p-1 text-paragraph-p2 text-primary-500">
            <Input
              noFill
              value={search}
              onChange={setSearch}
              placeholder={`Search with user name...`}
            />
            <MaterialSymbol icon="search" size={24} />
          </div>
          {mode ? (
            <ManageModeHeaderButton
              baseUrl={`/guilds/${params.gid}/missions`}
              query={query}
              mode={mode}
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
        </div>
        <div className="flex h-full w-full overflow-auto">
          <div className="mr-4 flex w-full flex-col gap-2">
            <div className="flex h-0 w-full flex-1 items-center justify-center">
              {(() => {
                if (!isFetched)
                  return (
                    <div className="text-heading-h3 text-primary-300">
                      <Loading />
                    </div>
                  );
                if (!filteredMission?.length)
                  return (
                    <div className="text-heading-h3 text-primary-300">
                      No Mission
                    </div>
                  );
                return (
                  <div className="flex h-full w-full flex-1 flex-col gap-2 overflow-auto">
                    {filteredMission.map(({ id, ...data }) => (
                      <MissionBar
                        onClick={() => handleMissionClick(id)}
                        key={id}
                        focus={selectedDetail?.id === id}
                        {...data}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
            {mode === 'manage' && (
              <Button
                size="md"
                className="m-auto w-max !rounded-3xl !pr-5"
                onClick={() => setModalStatus({ isOpen: true })}
                prefix={<MaterialSymbol icon="add" />}
              >
                CREATE NEW MISSION
              </Button>
            )}
            {mode === 'template' && (
              <Button
                size="md"
                className="m-auto w-max !rounded-3xl !pr-5"
                onClick={() => setModalStatus({ isOpen: true })}
                prefix={<MaterialSymbol icon="add" />}
              >
                CREATE NEW TEMPLATE
              </Button>
            )}
          </div>
          {(() => {
            if (!focusMissionId)
              return <EmptyMissionDetail className="w-full" />;
            if (!selectedDetail)
              return <EmptyMissionDetail className="w-full" />;
            return (
              <MissionDetailBlock
                key={selectedDetail.id}
                detail={selectedDetail}
                className="w-full"
                onCheckItemClick={handleCheckboxClick}
                mode={mode}
                headerBtn={
                  mode && (
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
                  mode,
                  onBtnClick: handleBtnClick,
                  userId: userMe.id,
                })}
              />
            );
          })()}
        </div>
      </PaperLayout>
      <AddMissionModal
        key={modalStatus.isOpen ? 'modal open' : 'modal close'}
        modalStatus={modalStatus}
        mode={mode}
        onClose={() => setModalStatus({ isOpen: false })}
        onFinish={handleSubmitModal}
      />
    </>
  );
};
