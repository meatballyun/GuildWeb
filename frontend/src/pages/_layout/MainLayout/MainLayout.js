import './styles.css';
import { SideBar, SideBarProvider } from './SideBar';
import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div className="main-layout-container">
      <SideBarProvider>
        <SideBar />
        <div className="content">
          <Outlet />
        </div>
      </SideBarProvider>
    </div>
  );
};
