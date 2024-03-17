import './styles.css';
import { SideBar } from './SideBar';
import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div className="main-layout-container">
      <SideBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
