import api from '../utils/api';
import { setAlert } from './alert';
import { CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, GET_ALL_PROFILES, GET_REPOS } from '../actions/types';


// Get current user's profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await api.get('/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Clear profile from state

export const clearProfile = () => dispatch => {
    try {

        dispatch({
            type: CLEAR_PROFILE
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Get all profiles

export const getAllProfiles = () => async dispatch => {
    try {
        const res = await api.get('/profile');

        dispatch({
            type: GET_ALL_PROFILES,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Get profile by user ID

export const getProfileById = (userId) => async dispatch => {
    try {
        const res = await api.get(`/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Get Github repos

export const getGithubRepos = (username) => async dispatch => {
    try {
        const res = await api.get(`/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Create or update profile
// history object for route redirection
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const res = await api.post('/profile', formData);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if(!edit) {
            history.push('/dashboard')
        }

    } catch (err) {
        const errors = err.response.data.errors;
    
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add Experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const res = await api.put('/profile/experience', formData);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
    
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add Education

export const addEducation = (formData, history) => async dispatch => {
    try {
        const res = await api.put('/profile/education', formData);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
    
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete Experience 

export const deleteExperience = (id) => async dispatch => {
    try {
        const res = await api.delete(`/profile/experience/${id}`);

        dispatch({
           type: UPDATE_PROFILE,
           payload: res.data
        });

        dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete Education 

export const deleteEducation = (id) => async dispatch => {
    try {
        const res = await api.delete(`/profile/education/${id}`);

        dispatch({
           type: UPDATE_PROFILE,
           payload: res.data
        });

        dispatch(setAlert('Education Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete Account and Profile

export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This action cannot be undone!')) {
        try {
            await api.delete(`/profile`);
    
            dispatch({ type: CLEAR_PROFILE});
            dispatch({ type: DELETE_ACCOUNT });
            
            dispatch(setAlert('Your account has been permanently deleted'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
    
};