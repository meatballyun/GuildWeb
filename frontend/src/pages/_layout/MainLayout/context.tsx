import { createContext } from 'react';

const defaultValue = {
  activeKey: [],
  setActiveKey: () => {},
};

export type ActiveKeyType = string[] | string | null;

export interface SideBarContext {
  activeKey: ActiveKeyType;
  setActiveKey: (value: ActiveKeyType) => void;
}

export const sideBarContext = createContext<SideBarContext>(defaultValue);
