import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {

    const { id } = useParams()
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
        if (!username) {
            errors.username = 'Username is required';
            valid = false;
        }
        if (!email) {
            errors.email = 'email is required';
            valid = false;
        } if (!password) {
            errors.password = 'Password is required';
            valid = false;
        }
        setErrors(errors);
        return valid;
    };

    // Toget user by Id
    useEffect(() => {
        console.log('Fetching user profile for id:', id);

        if (id) {
            axios.get(`http://localhost:3001/auth/getUserProfile/${id}`)
                .then(result => {
                    console.log(result);
                    setUsername(result.data.username);
                    setEmail(result.data.email);
                    setPassword(result.data.password);
                })
                .catch(err => console.log(err));
        }
    }, [id]);

    // Upadete the user profile data's
    const Update = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.put(`http://localhost:3001/auth/updateUserProfile/${id}`, { username, email, password, confirmpassword })
                .then(result => {
                    console.log(result)
                    navigate('/home')
                })
                .catch(err => console.log(err))
        }
    }
    return (
        <div >
            <h1 style={{ textAlign: 'center' }}>Profile</h1>
            <div className="card-box-emp" style={{ marginTop: '1%' }}>
                {/* Form for User profile  */}
                <form onSubmit={Update}>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <label>Username:</label>
                            <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} value={username} onChange={(e) => setUsername(e.target.value)} />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            <br />
                        </div>
                        <div className='col-sm-6'>
                            <label>Email:</label>
                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            <br />
                        </div>
                        <div className='col-sm-6'>
                            <label>Password:</label>
                            <div className='input-group'>
                                <input type={showPassword ? 'text' : 'password'} placeholder='Enter Password'
                                    className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button className='btn btn-outline-secondary' type='button'
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <i className='fas fa-eye'></i>
                                    ) : (
                                        <i className='fas fa-eye-slash'></i>
                                    )}
                                </button>
                            </div>
                            <br />
                        </div>
                        <div className='row'>
                            <div className='col-sm-8'>
                                <button className='btn btn-primary' type="submit">Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfile


