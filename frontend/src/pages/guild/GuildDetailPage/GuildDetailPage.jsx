import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../../api';
import { Paper, Block, PaperLayout } from '../../_layout/components';
import { useNavigate, useParams } from 'react-router';
import {
  Button,
  ImageUploader,
  Form,
  Input,
  useFormInstance,
  Loading,
  validate,
} from '../../../components';
import { useSideBar } from '../../_layout/MainLayout/SideBar';
import { useGuild, useUserMe } from '../../_layout';
import { TextArea } from '../../../components/Form/TextArea';
import { UserItem } from '../components';
import { InviteMemberModal } from '../modal';
import { ActionsButtons } from './ActionsButtons';

export const GuildDetailPage = ({ editMode }) => {
  const navigate = useNavigate();
  const params = useParams();
  useSideBar({ activeKey: ['guilds', params.id] });

  const { getGuildList } = useGuild();
  const { userMe } = useUserMe();
  const [openModal, setOpenModal] = useState(false);

  const [isGuildDetailFetched, setIsGuildDetailFetched] = useState(false);
  const [guildDetail, setGuildDetail] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const [isGuildMemberFetched, setIsGuildMemberFetched] = useState(false);
  const [guildMember, setGuildMember] = useState([]);

  const myMemberShip = useMemo(() => {
    if (!guildMember?.length || !userMe) return undefined;
    const myDataInGuild = guildMember.find(({ id }) => id === userMe.id);
    return myDataInGuild?.membership ?? null;
  }, [guildMember, userMe]);

  useEffect(() => {
    if (myMemberShip !== null || !editMode || params.id === 'new') return;
    navigate(-1);
  }, [myMemberShip, navigate, editMode, params.id]);

  const fetchGuildDetail = useCallback(async () => {
    try {
      setIsGuildDetailFetched(false);

      const res = await api.guild.getGuildsDetail({
        pathParams: { gid: params.id },
      });
      if (res.status !== 200) throw Error(res);
      const json = await res.json();
      setGuildDetail(json.data);
      setIsGuildDetailFetched(true);
    } catch {
      navigate('/');
    }
  }, [params.id, navigate]);

  const fetchGuildMember = useCallback(async () => {
    setIsGuildMemberFetched(false);
    const res = await api.guild.getGuildsMember({
      pathParams: { gid: params.id },
    });
    if (res.status !== 200) {
      setIsGuildMemberFetched(true);
      return;
    }
    const json = await res.json();
    setGuildMember(json.data);
    setIsGuildMemberFetched(true);
  }, [params.id]);

  const handleSubmit = async (formData) => {
    const apiUtil =
      params.id === 'new' ? api.guild.postGuilds : api.guild.putGuilds;
    const res = await apiUtil({
      body: { ...formData },
      pathParams: { id: params.id },
    });
    if (res.status === 200) {
      const json = await res.json();
      await getGuildList();
      navigate(`/guilds/${json.data.id ?? params.id}`);
    }
  };

  const form = useFormInstance({
    defaultValue: guildDetail,
    validateObject: { name: [validate.required] },
    onSubmit: handleSubmit,
  });

  const handleModalClose = (user) => {
    setOpenModal(false);
    if (!user) return;
    api.guild.postGuildsInvitation({
      pathParams: { gid: params.id },
      body: { uid: user.id },
    });
  };

  const handleDelete = async () => {
    await api.guild.deleteGuilds({ pathParams: { gid: params.id } });
    await fetchGuildMember();
    await getGuildList();
    navigate('..');
  };

  const handleLeave = async () => {
    await api.guild.deleteGuildsMember({
      pathParams: { gid: params.id, uid: userMe.id },
    });
    getGuildList();
    navigate('/guilds');
  };

  useEffect(() => {
    if (params.id === 'new') {
      if (!userMe) return;
      setIsGuildDetailFetched(true);
      setIsGuildMemberFetched(true);
      setGuildMember([
        {
          id: userMe.id,
          name: userMe.name,
          imageUrl: userMe.imageUrl,
          rank: userMe.rank,
          membership: 'Master',
        },
      ]);
      return;
    }
    fetchGuildDetail();
    fetchGuildMember();
  }, [fetchGuildDetail, fetchGuildMember, params.id, userMe]);

  const handleMemberClick = async (value, uid) => {
    switch (value) {
      case 'Vice':
      case 'Regular':
        api.guild.patchGuildsMember({
          pathParams: { gid: params.id, uid },
          body: { membership: value },
        });
        break;
      case 'Delete':
        api.guild.deleteGuildsMember({
          pathParams: { gid: params.id, uid },
        });
        break;
      default:
    }
    fetchGuildMember();
  };

  const currentGuildMember = useMemo(() => {
    if (editMode) return guildMember;
    return guildMember.filter(({ membership }) => membership !== 'Pending');
  }, [editMode, guildMember]);

  if (!isGuildDetailFetched)
    return (
      <PaperLayout>
        <PaperLayout.Content>
          <Loading className="text-heading-h3 text-primary-300" />
        </PaperLayout.Content>
      </PaperLayout>
    );

  return (
    <>
      <Form form={form} disabled={!editMode}>
        <Paper row className="flex gap-2">
          {/* left panel */}
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 p-2">
            <Form.Item valueKey="name" className="w-full">
              <Input
                type="underline"
                inputClassName="text-center text-heading-h1 text-primary-600"
                placeholder="enter guild name"
              />
            </Form.Item>
            <div className="m-1 flex h-[50vh] w-full items-center overflow-hidden border-[20px] border-primary-200">
              <Form.Item valueKey="imageUrl" noStyle>
                <ImageUploader type="guild" />
              </Form.Item>
            </div>
            <div className="flex justify-center gap-2">
              <ActionsButtons
                editMode={editMode}
                guildId={params.id}
                myMemberShip={myMemberShip}
                onSubmit={form.submit}
                onLeave={handleLeave}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* right panel */}
          <div className="flex w-full flex-1 flex-col overflow-hidden">
            <Block
              title={
                <div>
                  Member
                  {['Master', 'Vice'].includes(myMemberShip) && !editMode && (
                    <Button
                      className="float-right"
                      onClick={() => setOpenModal(true)}
                    >
                      Invite
                    </Button>
                  )}
                </div>
              }
              className="mb-2 flex-1"
            >
              {(() => {
                if (!isGuildMemberFetched)
                  return (
                    <div className="flex w-full flex-col items-center justify-center">
                      <Loading className="text-heading-h3 text-primary-300" />
                    </div>
                  );
                return (
                  <div className="flex w-full flex-col gap-1">
                    {currentGuildMember.map((data) => (
                      <UserItem
                        editAble={
                          data.membership !== 'Master' &&
                          myMemberShip === 'Master' &&
                          editMode
                        }
                        key={data.id}
                        {...data}
                        onItemClick={(value) =>
                          handleMemberClick(value, data.id)
                        }
                      />
                    ))}
                  </div>
                );
              })()}
            </Block>
            <Block
              title="Description"
              className="flex flex-1 text-paragraph-p3"
            >
              <Form.Item valueKey="description" noStyle>
                <TextArea placeholder="text something..." className="p-0" />
              </Form.Item>
            </Block>
          </div>
        </Paper>
      </Form>
      <InviteMemberModal
        isOpen={openModal}
        guildMemberList={guildMember}
        onClose={handleModalClose}
      />
    </>
  );
};
