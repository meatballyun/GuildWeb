export const MISSION_STATUS_LIST = [
  { textColor: 'text-blue', background: 'bg-blue', text: 'established' },
  {
    textColor: 'text-primary-400',
    background: 'bg-primary-400',
    text: 'In Progress',
  },
  { textColor: 'text-green', background: 'bg-green', text: 'completed' },
  { textColor: 'text-orange', background: 'bg-orange', text: 'expired' },
  { textColor: 'text-red', background: 'bg-red', text: 'cancelled' },
] as const;

export const FILTER_LIST = [
  { name: 'all', text: 'Mission List' },
  { name: 'accepted', text: 'Accepted' },
  { name: 'inProgress', text: 'In Progress' },
  { name: 'completed', text: 'Completed' },
  { name: 'expired', text: 'Expired' },
] as const;
