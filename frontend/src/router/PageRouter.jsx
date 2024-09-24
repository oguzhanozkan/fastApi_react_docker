import React from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../context/ProtectedRoute';


import WelcomePage from '../pages/WelcomePage'
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

import UsersPage from '../pages/admin/UsersPage';
import AdminLibraryPage from '../pages/admin/AdminLibraryPage'
import UserInfoPage from '../pages/admin/UserInfoPage';
import OverdueBooksPage from '../pages/admin/OverdueBooksPage';

import UserPage from '../pages/user/UserPage'
import UserLibrariyPage from '../pages/user/UserLibraryPage';

function PageRouter() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<WelcomePage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='*' element={<NotFoundPage />} />

                { /* protected */}
                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                    <Route element={<UsersPage />} path='/users'></Route>
                </Route>

                { /* protected */}
                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                    <Route element={<AdminLibraryPage />} path='/adminlibrary'></Route>
                </Route>

                { /* protected */}
                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                    <Route element={<UserInfoPage />} path='/userInfo'></Route>
                </Route>

                { /* protected */}
                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                    <Route element={<OverdueBooksPage />} path='/overdueBooks'></Route>
                </Route>

                { /* protected */}
                <Route element={<ProtectedRoute roles={['ADMIN', 'USER']} />}>
                    <Route element={<UserPage />} path='/user'></Route>
                </Route>

                { /* protected */}
                <Route element={<ProtectedRoute roles={['ADMIN', 'USER']} />}>
                    <Route element={<UserLibrariyPage />} path='/userlibrary'></Route>
                </Route>
            </Routes>


        </div>
    )
}

export default PageRouter