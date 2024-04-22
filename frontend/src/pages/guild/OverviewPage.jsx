import { Link } from 'react-router-dom';
import { Button } from '../../components';
import { Paper } from '../_layout/components';
import { useSideBar } from '../_layout/MainLayout/SideBar';

export const OverviewPage = () => {
  useSideBar({ activeKey: ['guild', 'overview'] });
  return (
    <Paper>
      <Link to="new/edit">
        <Button>add guild</Button>
      </Link>
    </Paper>
  );
};
