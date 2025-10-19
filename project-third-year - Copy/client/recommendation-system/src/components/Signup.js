import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import './Login.css'; 

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: ''
    });
    const navigate = useNavigate();

    const { name, email, password, retypePassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        if (password !== retypePassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            // --- THIS IS THE CORRECTED LINE ---
            // We now send 'retypePassword' to the backend as well.
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, retypePassword });
            
            toast.success(res.data.msg); 
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Something went wrong!';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="login-box">
            <p>Sign Up</p>
            <form onSubmit={onSubmit}>
                <div className="user-box">
                    <input type="text" name="name" value={name} onChange={onChange} required />
                    <label>Name</label>
                </div>
                <div className="user-box">
                    <input type="email" name="email" value={email} onChange={onChange} required />
                    <label>Email</label>
                </div>
                <div className="user-box">
                    <input type="password" name="password" value={password} onChange={onChange} required />
                    <label>Password</label>
                </div>
                <div className="user-box">
                    <input type="password" name="retypePassword" value={retypePassword} onChange={onChange} required />
                    <label>Retype Password</label>
                </div>
                <button type="submit">
                    <span></span><span></span><span></span><span></span>
                    Submit
                </button>
            </form>
            <p>Already have an account?{' '}<Link to="/login" className="a2">Log In!</Link></p>
        </div>
    );
};

export default Signup;