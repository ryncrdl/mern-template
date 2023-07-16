import { Outlet } from 'react-router-dom';
import DashFooter from './DashFooter';
import DashHeader from './DashHeader';
const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <Outlet />
      <DashFooter />
    </>
  );
};

export default DashLayout;
