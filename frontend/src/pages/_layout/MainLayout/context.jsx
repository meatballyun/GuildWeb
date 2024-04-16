import { createContext } from 'react';

const defaultValue = {
  activeKey: [],
  setActiveKey: () => {},
};

export const sideBarContext = createContext(defaultValue);
