import { Navigate } from "react-router-dom";

export default function Auth({ children }) {
    return localStorage.getItem("token") ? children : <Navigate to='/login' replace={true} />
}
