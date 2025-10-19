import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // 
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    //  removing the 'error' state now
    // const [error, setError] = useState(''); 
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setIsLoggedIn(true);
            toast.success('Logged in successfully!', { position: "top-center" });
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Something went wrong!';
            toast.error(errorMsg); // 
        }
    };

    return (
        <div className="login-box">
            <p>Login</p>
            <form onSubmit={onSubmit}>
                <div className="user-box">
                    <input type="email" name="email" value={email} onChange={onChange} required />
                    <label>Email</label>
                </div>
                <div className="user-box">
                    <input type="password" name="password" value={password} onChange={onChange} required />
                    <label>Password</label>
                </div>
                <button type="submit">
                    <span></span><span></span><span></span><span></span>
                    Submit
                </button>
            </form>
            <p>Need an account?{' '}<Link to="/signup" className="a2">Sign Up!</Link></p>
        </div>
    );
};

export default Login;