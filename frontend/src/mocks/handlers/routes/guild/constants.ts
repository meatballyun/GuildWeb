import type { Membership } from '../../../../api/guild/interface';

export const GUILD = [
  {
    id: 1,
    name: 'Blades of Fire Guild',
    imageUrl: 'https://images.plurk.com/3wcE9iSozi6UBO3lToF5el.png',
  },
  {
    id: 2,
    name: 'Ancient Explorers Association',
    imageUrl: 'https://images.plurk.com/2M5Cw3v6Az9fU17RRxmIlQ.jpg',
  },
  {
    id: 3,
    name: 'Magic Explorers Guild',
    imageUrl: 'https://images.plurk.com/78KeGU6e08O6hjFSIhiuCM.png',
  },
];

const USERS = [
  {
    id: 2,
    name: 'rex',
    imageUrl: null,
    rank: 1,
    membership: 'Master',
  },
  {
    id: 4,
    name: 'eva',
    imageUrl: null,
    rank: 1,
    membership: 'Vice',
  },
  {
    id: 6,
    name: '天上天下宇宙至尊大大ㄉㄉ醬二號',
    imageUrl: 'https://images.plurk.com/6FEWRrLpdbiTJUZ8Zpemak.png',
    rank: 1,
    membership: 'Regular',
  },
  {
    id: 8,
    name: 'User2',
    imageUrl: null,
    rank: 1,
    membership: 'Vice',
  },
  {
    id: 9,
    name: 'User3',
    imageUrl: null,
    rank: 1,
    membership: 'Regular',
  },
];

export const getUser = ({
  myMembership,
  availableUser,
}: {
  myMembership?: Membership;
  availableUser?: number[];
} = {}) => {
  const newUser = [...USERS];
  newUser[2].membership = myMembership ?? '';
  return availableUser?.length
    ? newUser.filter((_, i) => availableUser.includes(i))
    : newUser;
};

export const TASKS = [
  {
    id: 16,
    name: 'Task 0',
    type: 'Ordinary',
    status: 'Established',
    accepted: false,
    repetitiveTaskType: 'None',
  },
  {
    id: 17,
    name: 'Task 1',
    type: 'Emergency',
    status: 'In Progress',
    accepted: true,
    repetitiveTaskType: 'None',
  },
  {
    id: 18,
    name: 'Task 2',
    type: 'Repetitive',
    status: 'Completed',
    accepted: true,
    repetitiveTaskType: 'Weekly',
  },
  {
    id: 19,
    name: 'Task 3',
    type: 'Repetitive',
    status: 'Expired',
    accepted: false,
    repetitiveTaskType: 'Daily',
  },
  {
    id: 20,
    name: 'Task 4',
    type: 'Ordinary',
    status: 'Pending Activation',
    accepted: false,
    repetitiveTaskType: 'Weekly',
  },
  {
    id: 21,
    name: 'Task 5',
    type: 'Repetitive',
    status: 'Cancelled',
    accepted: false,
    repetitiveTaskType: 'Monthly',
  },
  {
    id: 22,
    name: 'Task 6',
    type: 'Ordinary',
    status: 'In Progress',
    accepted: false,
    maxAccept: true,
    repetitiveTaskType: 'Daily',
  },
];

export const getTaskDetail = (tId: number) => {
  const baseTask = TASKS.find(({ id }) => id === tId);
  return {
    ...(baseTask ?? TASKS[0]),
    guildId: 45,
    initiationTime: '2024-04-15',
    deadline: '2024-04-30',
    description:
      'Embark on a quest to retrieve the legendary Sword of Valor from the depths of the Dark Forest.',
    maxAdventurer: 3,
    adventurers: [...USERS].splice(0, tId - 16),
    items: [
      { content: 'Explore the Dark Forest' },
      { content: 'Seek Guidance' },
      { content: 'Overcome Obstacles' },
      { content: 'Locate the Sword of Valort' },
      { content: 'Defeat the Guardian' },
      { content: 'Retrieve the Sword of Valor' },
    ],
  };
};
