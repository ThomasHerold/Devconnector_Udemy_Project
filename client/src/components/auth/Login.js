import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const handleChange = (evt) => {
        const newFormData = {
            ...formData,
            [evt.target.name]: evt.target.value
        };

        setFormData(newFormData);
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        login(email, password);
    };

    // Redirect if authenticated
    if(isAuthenticated) {
        return <Redirect to="/dashboard" />
    };

    return (
    <div>
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i>Sign Into Your Account</p>
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
            <input 
                type="email" 
                placeholder="Email Address" 
                name="email" 
                value={email} 
                onChange={handleChange} 
                required 
            />
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
            <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
            Don't have an account? <Link to="/register">Register</Link>
        </p>
    </div>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);