import { Link } from 'react-router-dom';
import { api } from '../../../api';
import { useContext, useEffect, useState } from 'react';
import { Button, Avatar, ColumnBar, MaterialSymbol } from '../../../components';
import { classNames } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { ActiveKeyType, sideBarContext } from './context';
import { useGuild, useUserMe } from './MainLayout';
import { BASIC_SIDEBAR_LIST, SidebarItemType } from './constants';
import { Guild } from '../../../api/guild/interface';

const getGuildSidebarItem = (guilds: Guild[] = []): SidebarItemType => ({
  label: 'GUILD',
  key: 'missions',
  icon: 'demography',
  name: 'guilds',
  children: [
    {
      label: 'introduction',
      key: 'introduction',
      route: '/guilds',
      name: 'introduction',
      icon: 'menu_book',
    },
    ...guilds.map(({ id, name, imageUrl }) => ({
      label: (
        <div key={id} className="flex items-start gap-1">
          <Avatar size={20} name={name} className="mt-[2px]" url={imageUrl} />
          {name}
        </div>
      ),
      key: `guilds.${id}`,
      route: `/guilds/${id}`,
      name: String(id),
    })),
  ],
});

export const SideBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  return (
    <sideBarContext.Provider value={{ activeKey, setActiveKey }}>
      {children}
    </sideBarContext.Provider>
  );
};

export const useSideBar = ({
  activeKey: activeKeyProp,
}: {
  activeKey: ActiveKeyType;
}) => {
  const { setActiveKey } = useContext(sideBarContext);
  const activeKeyChangeCheck = Array.isArray(activeKeyProp)
    ? activeKeyProp.join('')
    : activeKeyProp;

  useEffect(() => {
    setActiveKey(activeKeyProp);
  }, [activeKeyChangeCheck]);
};

const UserItem = () => {
  const { userMe } = useUserMe();
  if (!userMe) return null;
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <Avatar size={48} url={userMe.imageUrl} name={userMe.name} />
        <div className="text-heading-h3">{userMe.name}</div>
      </div>
      <div className="text-right text-heading-h4">LV. {userMe.rank}</div>
      <div className="flex justify-between">
        <span>Exp.</span>
        <span>
          <span className="text-base text-blue-100">{userMe.exp}</span>
          <span className="text-primary-200"> / {userMe.upgradeExp}</span>
        </span>
      </div>
      <ColumnBar
        total={userMe.upgradeExp}
        height={12}
        items={[{ value: userMe.exp, color: '#4C76C7' }]}
      />
    </div>
  );
};

interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string[];
}

const MenuLabel = ({ name, children, className, ...props }: MenuLabelProps) => {
  const { activeKey } = useContext(sideBarContext);
  const activeList = Array.isArray(activeKey) ? activeKey : [activeKey];
  const active = name && !name.some((v, i) => v !== activeList[i]);

  return (
    <div
      className={classNames(
        'menu-label',
        active ? 'menu-label--active' : 'menu-label--no-active',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface MenuItemProps extends Omit<SidebarItemType, 'name'> {
  name: string | string[];
}

const MenuItem = ({
  children,
  route,
  icon,
  label,
  name,
  ...props
}: MenuItemProps) => {
  const [showChildren, setShowChildren] = useState(true);
  const currentName: string[] = Array.isArray(name) ? name : [name];

  if (children) {
    return (
      <div>
        <MenuLabel
          className="menu-subtitle"
          name={currentName}
          onClick={() => setShowChildren((show) => !show)}
          {...props}
        >
          {icon && (
            <div className="icon">
              <MaterialSymbol fill icon={icon} />
            </div>
          )}
          {label}
          <MaterialSymbol
            icon={showChildren ? 'remove' : 'add'}
            className="ml-auto"
          />
        </MenuLabel>
        {showChildren && (
          <div className="menu-container">
            {children.map(({ name: childName, ...childProp }) => (
              <MenuItem
                key={childName}
                name={[...currentName, childName]}
                {...childProp}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <Link to={route ?? ''}>
      <MenuLabel name={currentName} {...props}>
        {icon && (
          <div className="icon">
            <MaterialSymbol fill icon={icon} />
          </div>
        )}
        {label}
      </MenuLabel>
    </Link>
  );
};

export const SideBar = () => {
  const navigate = useNavigate();
  const { guildList } = useGuild();

  const handleLogout = async () => {
    await api.auth.logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sidebarList = [...BASIC_SIDEBAR_LIST, getGuildSidebarItem(guildList)];

  return (
    <div className="sidebar">
      <Link to="/settings">
        <UserItem />
      </Link>
      <div className="sidebar-main flex flex-col gap-2 overflow-auto">
        {sidebarList.map(({ key, ...props }) => (
          <MenuItem {...props} key={key} />
        ))}
      </div>
      <div>
        <Button
          size="lg"
          className="w-full justify-center"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
