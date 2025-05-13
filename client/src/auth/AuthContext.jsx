import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const res = await api.post('/login', credentials);

            if (res.data.success) {
                const { user, token } = res.data;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                setUser(user);
                setIsAuthenticated(true);

                return { success: true };
            }

            return { success: false, error: res.data.error || 'Login failed' };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Network error',
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.error('Logout API failed:', err);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
    };

    const signup = async (newUser) => {
        try {
            const res = await api.post('/signup', newUser);
            if (res.data.success) {
                const { user, token } = res.data;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                setUser(user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, error: res.data.error || 'Signup failed' };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Network error',
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
                signup,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
