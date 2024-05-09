export const BASIC_SIDEBAR_LIST = [
  {
    label: 'HOME',
    key: 'home',
    icon: 'home',
    route: '/',
    name: 'home',
  },
  {
    label: 'ADVENTURE REPORTS',
    key: 'notifications',
    icon: 'notifications',
    route: '/notifications',
    name: 'notifications',
  },
  {
    label: 'FRIENDS',
    key: 'friends',
    icon: 'group',
    route: '/friends',
    name: 'friends',
  },
  {
    label: 'FOOD',
    key: 'foods',
    name: 'foods',
    icon: 'restaurant',
    children: [
      {
        label: 'introduction',
        key: 'introduction',
        route: '/foods',
        name: 'introduction',
        icon: 'menu_book',
      },
      {
        label: 'records',
        key: 'records',
        route: '/foods/records',
        name: 'records',
        icon: 'fastfood',
      },
      {
        label: 'recipes',
        key: 'recipes',
        route: '/foods/recipes',
        name: 'recipes',
        icon: 'soup_kitchen',
      },
      {
        label: 'ingredients',
        key: 'ingredients',
        route: '/foods/ingredients',
        name: 'ingredients',
        icon: 'grocery',
      },
    ],
  },
];
