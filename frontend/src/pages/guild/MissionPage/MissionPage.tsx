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
import { Task, TaskTemplate } from '../../../api/guild/interface';
import { MissionButtonType, MissionPageMode, Query } from './interface';

export enum ModalType {
  NEW = 'new',
  EDIT = 'edit',
}

export interface ModalStatus {
  isOpen?: boolean;
  formData?: Task | TaskTemplate;
  type?: ModalType;
}

export const MissionPage = ({ mode }: { mode?: MissionPageMode }) => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useSideBar({ activeKey: ['guilds', params.gid ?? ''] });
  const { userMe } = useUserMe();
  const navigate = useNavigate();
  const [missionList, setMissionList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<
    Task | TaskTemplate | undefined
  >();
  const { getMyMemberShipInGuild } = useGuild();

  const [query, setQuery] = useState<Query>({
    filter: 'all',
    missionType: [],
    missionStatus: [],
  });
  const [modalStatus, setModalStatus] = useState<ModalStatus>({});

  const filteredMission = useMemo(() => {
    if (!missionList?.length) return [];

    const baseFilteredMissionList = (() => {
      switch (query.filter) {
        case 'mine':
          return missionList.filter(({ creator }) => creator.id === userMe?.id);
        case 'accepted':
          return missionList.filter(
            ({ isAccepted, status }) => isAccepted && status === 'established'
          );
        case 'inProgress':
          return missionList.filter(
            ({ status, isAccepted }) => isAccepted && status === 'in progress'
          );
        case 'completed':
          return missionList.filter(
            ({ status, isAccepted }) => isAccepted && status === 'completed'
          );
        case 'expired':
          return missionList.filter(
            ({ status, isAccepted }) => isAccepted && status === 'expired'
          );
        case 'all':
        default:
          if (!mode)
            return missionList.filter(
              ({ status }) => status !== 'cancelled' && status !== 'expired'
            );
          return missionList;
      }
    })();

    return baseFilteredMissionList.filter(({ type, status }) => {
      const isCurrentType =
        !query.missionType?.length || query.missionType.includes(type);
      const isCurrentStatus =
        !query.missionStatus?.length ||
        (status && query.missionStatus.includes(status));
      return isCurrentType && isCurrentStatus;
    });
  }, [missionList, mode, query, userMe]);

  const fetchMissions = useCallback(async () => {
    const data =
      mode === MissionPageMode.TEMPLATE
        ? await api.guild.getTemplate({
            pathParams: { gid: params.gid },
            params: { q: search },
          })
        : await api.guild.getGuildsTasks({
            pathParams: { gid: params.gid },
            params: { q: search },
          });

    if (!Array.isArray(data)) return;
    setMissionList(data);
    return data;
  }, [mode, params.gid, search]);

  useEffect(() => {
    setSelectedDetail(undefined);
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

  const fetchMissionDetail = useCallback(
    async (newDataId?: number) => {
      const detailId = newDataId ?? focusMissionId;
      if (!detailId) return;
      const data =
        mode === MissionPageMode.TEMPLATE
          ? await api.guild.getTemplateDetail({
              pathParams: { gid: params.gid, ttid: detailId },
            })
          : await api.guild.getGuildsTasksDetail({
              pathParams: { gid: params.gid, tid: detailId },
            });
      return data;
    },
    [focusMissionId, mode, params.gid]
  );

  useEffect(() => {
    (async () => {
      const data = await fetchMissionDetail();
      if (data) setSelectedDetail(data);
    })();
  }, [fetchMissionDetail]);

  const handleMissionClick = (id: string) =>
    setSearchParams({ 'focus-mission-id': id });

  const handleSubmitModal = async (value: Task | TaskTemplate) => {
    const newDataId = await handleEditTasksFinish({
      type: modalStatus.type,
      gid: params.gid,
      selectedId: focusMissionId,
      value,
    });
    if (!newDataId) return;
    await fetchMissions();
    const detail = await fetchMissionDetail(newDataId);
    setSelectedDetail(detail);
  };

  const handleBtnClick = async (type: MissionButtonType) => {
    switch (type) {
      case MissionButtonType.EDIT:
        setModalStatus({
          isOpen: true,
          formData: selectedDetail,
          type: ModalType.EDIT,
        });
        break;

      case MissionButtonType.ACCEPT: {
        await api.guild.getGuildsTasksAccepted({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case MissionButtonType.COMPLETE: {
        await api.guild.patchGuildsTasksComplete({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case MissionButtonType.SUBMIT: {
        await api.guild.patchGuildsTasksSubmit({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case MissionButtonType.ABANDON: {
        await api.guild.getGuildsTasksAbandon({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case MissionButtonType.RESTORE:
        await api.guild.patchGuildsTasksRestore({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        await fetchMissions();
        setSelectedDetail(undefined);
        break;

      case MissionButtonType.CANCEL: {
        await api.guild.patchGuildsTasksCancel({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        await fetchMissions();
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case MissionButtonType.DISABLE:
      case MissionButtonType.ENABLE: {
        if (!selectedDetail || 'items' in selectedDetail) return;
        await api.guild.putTemplate({
          pathParams: { gid: params.gid, ttid: focusMissionId ?? undefined },
          data: {
            ...selectedDetail,
            enabled: !(
              selectedDetail &&
              'enabled' in selectedDetail &&
              selectedDetail.enabled
            ),
          },
        });
        await fetchMissions();
        const data = await fetchMissionDetail();
        setSelectedDetail(data);
        break;
      }

      case MissionButtonType.DELETE:
        if (mode === MissionPageMode.TEMPLATE) {
          await api.guild.deleteTemplate({
            pathParams: { gid: params.gid, ttid: focusMissionId },
          });
          await fetchMissions();
          setSelectedDetail(undefined);
          break;
        }
        await api.guild.deleteGuildsTasks({
          pathParams: { gid: params.gid, tid: focusMissionId },
        });
        await fetchMissions();
        setSelectedDetail(undefined);
        break;
      default:
    }
  };

  const handleCheckboxClick = async (itemRecordId?: number) => {
    await api.guild.patchTasksCheckbox({
      pathParams: { gid: params.gid },
      data: { itemRecordId },
    });
    const data = await fetchMissionDetail();
    setSelectedDetail(data);
  };

  const myMemberShip = getMyMemberShipInGuild(+(params?.gid ?? 0));
  const enableManage =
    myMemberShip && !mode && ['Vice', 'Master'].includes(myMemberShip);

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
            {mode === MissionPageMode.MANAGE && (
              <Button
                size="md"
                className="m-auto w-max !rounded-3xl !pr-5"
                onClick={() => setModalStatus({ isOpen: true })}
                prefix={<MaterialSymbol icon="add" />}
              >
                CREATE NEW MISSION
              </Button>
            )}
            {mode === MissionPageMode.TEMPLATE && (
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
                  userId: userMe?.id,
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

export default updateMissionStatus;
