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
      <Route path={'/:gid/missions'} element={<MissionPage key="mission" />} />
      <Route
        path={'/:gid/missions/manage'}
        element={<MissionPage key="manage" mode="manage" />}
      />
      <Route
        path={'/:gid/missions/template'}
        element={<MissionPage key="template" mode="template" />}
      />
    </Routes>
  );
};

export default GuildRoute;
