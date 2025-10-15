import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse the same CSS file from the Login component

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { name, email, password, retypePassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== retypePassword) {
            return setError('Passwords do not match');
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                retypePassword
            });
            setSuccess(res.data.msg);
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setError(err.response.data.msg || 'Something went wrong!');
        }
    };

    return (
        <div className="login-box">
            <p>Sign Up</p>
            {/* Display error or success messages here */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={onSubmit}>
                <div className="user-box">
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                    <label>Name</label>
                </div>
                <div className="user-box">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                    <label>Email</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                    <label>Password</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        name="retypePassword"
                        value={retypePassword}
                        onChange={onChange}
                        required
                    />
                    <label>Retype Password</label>
                </div>
                <button type="submit">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </button>
            </form>
            <p>
                Already have an account?{' '}
                <Link to="/login" className="a2">
                    Log In!
                </Link>
            </p>
        </div>
    );
};

export default Signup;