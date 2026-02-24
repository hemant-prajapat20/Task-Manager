import React from 'react'
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom'
import SignUp from './auth/SignUp'
import Login from './auth/Login'
import Dashboard from './Pages/Admin/Dashboard'
import ManageTask from './Pages/admin/ManageTask'
import ManageUsers from './Pages/admin/ManageUsers'
import CreateTask from './Pages/Admin/CreateTask'
import PrivateRoute from './routes/PrivateRoute'
import UserDashboard from './Pages/user/UserDashboard'
import TaskDetails from './Pages/user/TaskDetails'
import MyTask from './Pages/user/MyTask'

const App = () => {
  return (
    <div>
    
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/Signup' element={<SignUp/>}/>


        {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
            <Route path='/admin/dashboard' element={<Dashboard/>} />
            <Route path='/admin/tasks' element={<ManageTask/>} />
            <Route path='/admin/users' element={<ManageUsers/>} />
            <Route path='/admin/create-task' element={<CreateTask/>} />
          </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
          <Route path='/user/dashboard' element={<UserDashboard/>}/>
          <Route path='/user/task' element={<MyTask/>}/>
          <Route path='/user/task-details/:id' element={<TaskDetails/>}/>
 
        </Route>
     
        </Routes>

    </div>
  )
}

export default App
