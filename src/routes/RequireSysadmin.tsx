import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { USER_TYPES, type UserProfile } from '../core/types';

type RequireSysadminProps = {
  user: UserProfile | null;
};

function RequireSysadmin({ user }: RequireSysadminProps) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.type !== USER_TYPES.Sysadmin) {
    return <Navigate to="/" replace state={{ from: location.pathname, reason: 'forbidden' }} />;
  }

  return <Outlet />;
}

export default RequireSysadmin;
