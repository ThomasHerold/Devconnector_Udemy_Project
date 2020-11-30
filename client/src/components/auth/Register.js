import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        verifyPass: ''
    });

    const { name, email, password, verifyPass } = formData;

    const handleChange = (evt) => {
        const newFormData = {
            ...formData,
            [evt.target.name]: evt.target.value
        };

        setFormData(newFormData);
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if(password !== verifyPass) {
            console.log('Passwords do ntot match');
        } else {
            console.log(formData);
        }
    };

    return (
    <div>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
            <input type="text" placeholder="Name" name="name" value={name} onChange={handleChange} required />
            </div>
            <div className="form-group">
            <input type="email" placeholder="Email Address" name="email" value={email} onChange={handleChange} required />
            <small className="form-text">This site uses Gravatar so if you want a profile image, use a
                Gravatar email
            </small>
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Password"
                name="password"
                minLength="6"
                value={password} 
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Confirm Password"
                name="verifyPass"
                minLength="6"
                value={verifyPass} 
                onChange={handleChange}
                required
            />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
        </p>
    </div>
    );
};

export default Register;