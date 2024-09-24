
import { useContext } from 'react'
import { UserContext } from './UserContext'
import { UserInfoContext } from './UserInfoContext';
import { jwtDecode } from "jwt-decode"
import { Outlet, Navigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ProtectedRoute({ roles }) {

    let token = useContext(UserContext);
    let userId = useContext(UserInfoContext);

    if (token[0] == null) {
        return <Navigate to='/login' />
    } else {

        const token_decode = jwtDecode(token[0])

        if (!roles.includes(token_decode.role)) {
            return <Navigate to='/' />
        }
        if (!token_decode.active) {
            return <Navigate to='/login' />
        }
        
        return <Outlet />;
    }
}

export default ProtectedRoute