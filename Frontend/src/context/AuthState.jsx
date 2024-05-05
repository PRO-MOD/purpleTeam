import React, { useContext, useState } from "react";
import AuthContext from "./AuthContext";

const AuthState = (props) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Fetch user
    const fetchUserRole = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://13.233.214.116:5000/api/auth/getuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-token": localStorage.getItem('Hactify-Auth-token')
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUserRole, loading, error }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;
