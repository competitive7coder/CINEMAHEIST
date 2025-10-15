import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Imports the custom styles

// The component now accepts 'setIsLoggedIn' as a prop from App.js
const Login = ({ setIsLoggedIn }) => {
    // State to hold the form data (email and password)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State to hold any error messages from the server
    const [error, setError] = useState('');

    // Hook from react-router-dom to programmatically navigate
    const navigate = useNavigate();

    // Destructure email and password from the formData state for easier access
    const { email, password } = formData;

    // A single handler to update the state for any form field change
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Function to handle the form submission
    const onSubmit = async e => {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(''); // Clear any previous errors

        try {
            // Send a POST request to the backend login endpoint
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // If login is successful, store the token from the response
            localStorage.setItem('token', res.data.token);

            // Update the login state in the parent App.js component
            setIsLoggedIn(true);

            // Redirect the user to the dashboard page
            navigate('/dashboard');

        } catch (err) {
            // If there's an error, set the error state to display the message
            setError(err.response ? err.response.data.msg : 'Something went wrong!');
        }
    };

    return (
        <div className="login-box">
            <p>Login</p>
            {/* Display the error message if it exists */}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={onSubmit}>
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
                <button type="submit">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </button>
            </form>
            <p>
                Don't have an account?{' '}
                <Link to="/signup" className="a2">
                    Sign up!
                </Link>
            </p>
        </div>
    );
};

export default Login;