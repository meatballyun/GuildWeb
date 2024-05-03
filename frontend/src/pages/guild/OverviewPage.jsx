import { Link, useNavigate } from 'react-router-dom';
import { Button, MaterialSymbol, useNotification } from '../../components';
import { PaperLayout } from '../_layout/components';
import { useSideBar } from '../_layout/MainLayout/SideBar';
import { useGuild } from '../_layout/MainLayout/MainLayout';
import { api } from '../../api';

const data = [
  {
    type: 'title',
    content: 'Task Goal Management',
  },
  {
    type: 'description',
    content:
      'At GuildWeb, we provide a comprehensive task goal management feature that allows you to easily set and track pending tasks, as well as set repetitive goals. Whether you want to increase personal efficiency or achieve common goals with friends and family, we can meet your needs.',
  },
  {
    type: 'title',
    content: 'Tasks and Adventurers',
  },
  {
    type: 'description',
    content: `On our platform, pending tasks are called "missions," and you are called an "adventurer." Adventurers have their own "Personal Cabin" where you can customize missions according to your needs.
You can choose different types of tasks, such as 'Ordinary', 'Emergency', and 'Repetitive', and set different repeat times (daily, weekly, or monthly) based on your needs. Tasks can be subdivided into multiple sub-goals, allowing you to have a clearer understanding of your pending tasks and plan and complete them more easily.'`,
  },
  {
    type: 'title',
    content: 'Adventurer Guild',
  },
  {
    type: 'description',
    content: `In addition to the personal cabin, you can also establish a "guild" and invite other adventurers to pursue common goals. In the guild, the president and designated users (referred to as "administrators") have the right to set tasks, and guild members can freely choose to accept these tasks. This makes it easier to cooperate and complete tasks in the team, whether it's academic, family, or fitness-related.`,
  },
  {
    type: 'title',
    content: 'Application Scenarios',
  },
  {
    type: 'description',
    content: `Our task goal management feature is suitable for various scenarios, such as:

- Group reports or projects: 
  In academic or workplace teams, you can use our feature to allocate tasks, such as collecting data, organizing information, creating reports, and writing speeches.

- Household chores: 
  Family members can use our platform to coordinate and allocate household chores, such as shopping and cleaning.

- Exercise buddies: 
  Exercise enthusiasts can share and track exercise goals on our platform, such as daily jump rope counts and weekly exercise frequencies.`,
  },
  {
    type: 'description',
    content: `Wherever you are, our task goal management feature will become an indispensable tool in your life, helping you manage your time more effectively and achieve your goals!`,
  },
  {
    type: 'description',
    content: `

    
Sincerely,

Yun-T.Z. Development Team`,
  },
];

export const OverviewPage = () => {
  useSideBar({ activeKey: ['guilds', 'overview'] });
  const { guildList, getGuildList } = useGuild();
  const hasGuild = guildList?.length;
  const { Dom, promptNotification } = useNotification();
  const navigate = useNavigate();

  const handleAddCabin = async () => {
    promptNotification({ type: 'loading' });
    const res = await api.guild.postCabin();
    if (res.status === 200) {
      const json = await res.json();
      await getGuildList();
      navigate(`/guilds/${json.data.id}`);
    }
    promptNotification({ type: 'error', message: 'unknown error' });
  };

  return (
    <PaperLayout row="false" className="m-auto max-w-[720px] shadow-lg">
      <PaperLayout.Title>Guild Overview</PaperLayout.Title>
      <PaperLayout.Content className="overflow-auto whitespace-pre-wrap text-primary-600">
        <div className="flex h-full flex-col gap-4">
          {data.map(({ type, content }) => {
            if (type === 'title')
              return <div className="text-heading-h2">{content}</div>;
            return <div className="text-paragraph-p3">{content}</div>;
          })}
        </div>
      </PaperLayout.Content>
      <div className="m-auto mt-4">
        <Dom className="max-w-[240px]" />
        <div className="flex gap-2">
          {!hasGuild && (
            <Button
              onClick={handleAddCabin}
              prefix={<MaterialSymbol icon="roofing" />}
            >
              Create My Cabin
            </Button>
          )}
          {hasGuild && (
            <>
              <Link to={`${guildList[0].id}`}>
                <Button
                  type="hollow"
                  prefix={<MaterialSymbol icon="roofing" />}
                >
                  Enter My Cabin
                </Button>
              </Link>
              <Link to="new/edit">
                <Button prefix={<MaterialSymbol icon="add_circle" />}>
                  Create New Guild
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </PaperLayout>
  );
};
