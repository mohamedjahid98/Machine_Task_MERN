import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const validateForm = () => {
        let valid = true;
        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
            valid = false;
        } if (!username) {
            errors.username = 'Username is required';
            valid = false;
        } if (!password) {
            errors.password = 'Password is required';
            valid = false;
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(password)) {
                errors.password = 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.';
                valid = false;
            }
        }
        if (!confirmpassword) {
            errors.confirmpassword = 'Confirm Password is required';
            valid = false;
        } else if (password !== confirmpassword) {
            errors.confirmpassword = 'Passwords do not match';
            valid = false;
        }
        setErrors(errors);
        return valid;
    };
    // Save the User for signup
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            axios
                .post('http://localhost:3001/auth/signup', {
                    username,
                    email,
                    password,
                    confirmpassword,
                })
                .then((result) => {
                    console.log('Signup submitted:', result);

                    // Show success toast
                    toast.success(result.data.message || 'Signup successful');

                    // Optionally, navigate to another page
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                })
                .catch((err) => {
                    // Show error toast
                    toast.error(err.response.data.message || 'Error during signup. Please try again.');
                    console.error(err);
                });
        }
    };
    return (
        <div className='bgcolor'>
            <div>
                <ToastContainer />
            </div>
            <br />
            <h1 style={{ textAlign: 'center', color: "white" }}>Signup</h1>
            {/* form for User signup */}
            <div className="card-box-1" style={{ marginTop: '1%' }}>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <label>Username:</label>
                            <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} placeholder='Enter Username' onChange={(e) => setUsername(e.target.value)} />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            <br />
                        </div>
                        <div className='col-sm-12'>
                            <label>Email:</label>
                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            <br />
                        </div>
                        <div className='col-sm-12'>
                            <label>Password:</label>
                            <div className='input-group'>
                                <input type={showPassword ? 'text' : 'password'} placeholder='Enter Password'
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`} onChange={(e) => setPassword(e.target.value)} />
                                <button className='btn btn-outline-secondary' type='button'
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <i className='fas fa-eye'></i>
                                    ) : (
                                        <i className='fas fa-eye-slash'></i>
                                    )}
                                </button>
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <br />
                        </div>
                        <div className='col-sm-12'>
                            <label>Confirm Password:</label>
                            <div className='input-group'>
                                <input type={showConfirmPassword ? 'text' : 'password'} placeholder='Enter Password'
                                    className={`form-control ${errors.confirmpassword ? 'is-invalid' : ''}`} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <button className='btn btn-outline-secondary' type='button'
                                    onClick={() => setConfirmShowPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? (
                                        <i className='fas fa-eye'></i>
                                    ) : (
                                        <i className='fas fa-eye-slash'></i>
                                    )}
                                </button>
                                {errors.confirmpassword && <div className="invalid-feedback">{errors.confirmpassword}</div>}
                            </div>
                            <br />
                        </div>
                        <div className='row'>
                            <div className='col-sm-8'>
                                <button className='btn btn-success' type="submit">Login</button>
                            </div>
                            <div className='col-sm-4'>
                                Already <a href='/'> Login</a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <br />
        </div>
    )
}


export default Signup
