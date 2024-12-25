import { Route, Routes } from 'react-router-dom';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Error404 from '../screens/Error404';
import RedirectIfAuthenticated from '../components/RedirectIfAuthenticated';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../config/axios';
import { setError, setUser, setLoading as setLoad } from '../context/slices/userState';

export default function AppRoutes() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            };
            dispatch(setLoad())
            try {
                const response = await axios.get('/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const res = await response.data;
                console.log(res);
                dispatch(setUser({ user: res.data }));
            } catch (error) {
                dispatch(setError(error.response?.data?.message || 'Something went wrong'));
            }
            finally {
                setLoading(false);
            }



        }
        if (!isAuthenticated) fetchUserData();
    }, [dispatch, isAuthenticated])

    return loading ? (<h1 className='min-h-screen'>Loading...</h1>
    ): (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/signin" element={<RedirectIfAuthenticated ><Login /> </RedirectIfAuthenticated>} />
            <Route path="/signup" element={<RedirectIfAuthenticated ><Register /> </RedirectIfAuthenticated>} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    )
}