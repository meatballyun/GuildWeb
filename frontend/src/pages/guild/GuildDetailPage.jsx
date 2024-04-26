import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { Paper, Block } from '../_layout/components';
import { useNavigate, useParams } from 'react-router';
import {
  Button,
  ImageUploader,
  MaterialSymbol,
  Form,
  Input,
  useFormInstance,
} from '../../components';
import { useSideBar } from '../_layout/MainLayout/SideBar';
import { useGuild, useUserMe } from '../_layout';
import { TextArea } from '../../components/Form/TextArea';
import { Link } from 'react-router-dom';
import { UserItem } from './components';
import { InviteMemberModal } from './modal';
import { COLORS } from '../../styles';

export const GuildDetailPage = ({ editMode }) => {
  const navigate = useNavigate();
  const params = useParams();
  useSideBar({ activeKey: ['guild', params.id] });
  const { getGuildList } = useGuild();
  const [openModal, setOpenModal] = useState(false);
  const { userMe } = useUserMe();

  const [isGuildDetailFetched, setIsGuildDetailFetched] = useState(false);
  const [guildDetail, setGuildDetail] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const form = useFormInstance({ defaultValue: guildDetail });

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

      const res = await api.guild.getGuildDetail({
        pathParams: { id: params.id },
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
    const res = await api.guild.getGuildMember({
      pathParams: { id: params.id },
    });
    const json = await res.json();
    setGuildMember(json.data);
    setIsGuildMemberFetched(true);
  }, [params.id]);

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

  const handleMemberClick = async (value, userId) => {
    switch (value) {
      case 'Admin':
      case 'Regular':
        api.guild.patchGuildMember({
          pathParams: { id: params.id },
          body: { userId, membership: value },
        });
        break;
      case 'Delete':
        api.guild.deleteGuildMember({
          pathParams: { id: params.id, userId },
        });
        break;
      default:
    }
    fetchGuildMember();
  };

  const handleSubmit = async () => {
    const apiUtil =
      params.id === 'new' ? api.guild.addNewGuild : api.guild.editGuild;
    const res = await apiUtil({
      body: { ...form.formData },
      pathParams: { id: params.id },
    });
    if (res.status === 200) {
      const json = await res.json();
      await getGuildList();
      navigate(`/guild/${json.data.id ?? params.id}`);
    }
  };

  const handleModalClose = (user) => {
    setOpenModal(false);
    if (!user) return;
    api.guild.addNewGuildMember({
      pathParams: { id: params.id },
      body: { userId: user.id },
    });
  };

  const handleDelete = async () => {
    await api.guild.deleteGuild({ pathParams: { id: params.id } });
    await getGuildList();
    navigate('..');
  };

  if (!isGuildDetailFetched) return <Paper row>Loading</Paper>;

  return (
    <>
      <Form form={form} disabled={!editMode}>
        <Paper row className="flex gap-2">
          {/* left panel */}
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 p-2">
            <div className="w-full border-b-2 border-b-primary-600 text-center text-heading-h1 text-primary-600">
              <Form.Item valueKey="name">
                <Input
                  inputClassName="text-center text-heading-h1 text-primary-600"
                  placeholder="enter guild name"
                />
              </Form.Item>
            </div>
            <div className="m-1 flex h-[50vh] w-full items-center overflow-hidden border-[20px] border-primary-200">
              <Form.Item valueKey="imageUrl" noStyle>
                <ImageUploader type="guild" />
              </Form.Item>
            </div>
            <div className="flex justify-center gap-2">
              {editMode && (
                <>
                  {params.id !== 'new' && (
                    <div className="border-r-2 border-primary-300 pr-2">
                      <Button
                        className="h-full"
                        style={{ background: COLORS.red }}
                        size="md"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                  <Button onClick={() => navigate(-1)} type="hollow" size="md">
                    Cancel
                  </Button>
                  <Button size="md" onClick={handleSubmit}>
                    {params.id === 'new' ? 'Create' : 'Save'}
                  </Button>
                </>
              )}
              {!editMode && myMemberShip === 'Master' && (
                <Link to="edit">
                  <Button
                    type="hollow"
                    prefix={<MaterialSymbol icon="settings" />}
                  >
                    Manage
                  </Button>
                </Link>
              )}
              {!editMode && (
                <Link to="mission">
                  <Button prefix={<MaterialSymbol icon="event_note" />}>
                    Mission
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* right panel */}
          <div className="flex w-full flex-1 flex-col overflow-hidden">
            <Block
              title={
                <div>
                  Member
                  {['Master', 'Admin'].includes(myMemberShip) && !editMode && (
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
              <div className="flex w-full flex-col items-center gap-1">
                {(() => {
                  if (!isGuildMemberFetched) return 'loading';
                  if (guildMember?.length === 0) return 'no data';
                  return guildMember.map((data) => (
                    <UserItem
                      editAble={
                        data.membership !== 'Master' &&
                        myMemberShip === 'Master' &&
                        editMode
                      }
                      key={data.id}
                      {...data}
                      onItemClick={(value) => handleMemberClick(value, data.id)}
                    />
                  ));
                })()}
              </div>
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
      <InviteMemberModal isOpen={openModal} onClose={handleModalClose} />
    </>
  );
};
