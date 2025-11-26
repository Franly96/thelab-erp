import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import RequireSysadmin from './routes/RequireSysadmin';
import { useUserStore } from './store/useUserStore';

function App() {
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout user={user} onLogout={logout} />}>
          <Route index element={<Dashboard />} />
          <Route element={<RequireSysadmin user={user} />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>

        <Route element={<AuthLayout isAuthenticated={Boolean(user)} />}>
          <Route path="/login" element={<Login onLogin={login} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
