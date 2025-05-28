import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import ManagerLogin from '../pages/ManagerLogin';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import SignUp from '../pages/SignUp';
import ProtectedRoute from './ProtectedRoute';
import LoadingScreen from '../components/ui/LoadingScreen';

const AppRoutes = () => {
  const { isLoading, user, isManager } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/manager-login" element={user ? <Navigate to="/dashboard" /> : <ManagerLogin />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {isManager ? <ManagerDashboard /> : <EmployeeDashboard />}
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;