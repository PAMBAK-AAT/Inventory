
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/register');
        }else{
            if(user.role === 'admin'){
                navigate('/admin-dashboard');
            } else {
                navigate('/customer-dashboard');
            }
        }
    }, [user, navigate]);

    return null;
}

export default Root;

