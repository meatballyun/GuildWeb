import { Route, Routes } from 'react-router';
import { GuildDetailPage } from './GuildDetailPage';
import { OverviewPage } from './OverviewPage';
import { MissionPage } from './MissionPage';

const GuildRoute = () => {
  return (
    <Routes>
      <Route path={'/'} element={<OverviewPage />} />
      <Route path={'/:id'} element={<GuildDetailPage />} />
      <Route path={'/:id/edit'} element={<GuildDetailPage editMode />} />
      <Route path={'/:gid/mission'} element={<MissionPage />} />
      <Route
        path={'/:gid/mission/manage'}
        element={<MissionPage manageMode />}
      />
    </Routes>
  );
};

export default GuildRoute;
