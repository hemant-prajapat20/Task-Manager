import React from 'react'
import { BrowserRouter, Routes, Route ,Navigate } from 'react-router-dom'
import SignUp from './Pages/auth/SignUp'
import Login from './Pages/auth/Login'
import Dashboard from './Pages/Admin/Dashboard'
import ManageTask from './Pages/admin/ManageTask'
import ManageUsers from './Pages/admin/ManageUsers'
import CreateTask from './Pages/Admin/CreateTask'
import PrivateRoute from './routes/PrivateRoute'
import UserDashboard from './Pages/user/UserDashboard'
import TaskDetails from './Pages/user/TaskDetails'
import MyTask from './Pages/user/MyTask'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'



const App = () =>{
  return (
    <div>
    
     <Routes>
      {/* default route */}
      <Route path="/" element={<Root />}/>


      <Route path='/login' element={<Login/>}/>
       <Route path='/signup' element={<SignUp/>}/>


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
        <Route path='/user/tasks' element={<MyTask/>}/>
        <Route path='/user/task-details/:id' element={<TaskDetails/>}/>
      </Route>
      
    </Routes>
    <Toaster position="top-center" />
    </div>
  )
}

export default App

const Root=()=>{
   const {currentUser}=useSelector((state)=> state.user)
   if(!currentUser){
    return <Navigate to="/login" replace />
   }

   if (currentUser.role === "admin") {
     return <Navigate to="/admin/dashboard" replace />
   } else if (currentUser.role === "user") {
     return <Navigate to="/user/dashboard" replace />
   } else {
     return <Navigate to="/login" replace />
   }
}