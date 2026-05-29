import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './Pages/auth/SignUp';
import Login from './Pages/auth/Login';
import Dashboard from './Pages/adminPanel/Dashboard.jsx';
import ManageTask from './Pages/adminPanel/ManageTask.jsx';
import ManageUsers from './Pages/adminPanel/ManageUsers.jsx';
import CreateTask from './Pages/adminPanel/CreateTask.jsx';
import UserDashboard from './Pages/user/UserDashboard.jsx';
import TaskDetails from './Pages/user/TaskDetails.jsx';
import MyTask from './Pages/user/MyTask.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { Toaster } from 'react-hot-toast';


/**
 * Root redirect component – sends user to their role-based dashboard.
 */
const Root = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (currentUser.role === 'user') {
    return <Navigate to="/user/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTask />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTask />} />
          <Route path="/user/task-details/:id" element={<TaskDetails />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  );
};

export default App;