import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { school, degree, fieldOfStudy, from, to, current, description } = formData;

    const onChange = (evt) => {
        if(evt.target.name === "current") {
            setFormData({ ...formData, current: !current});
            toggleDisabled(!toDateDisabled);
        } else {
            setFormData({ ...formData, [evt.target.name]: evt.target.value})
        }
    }

    const onSubmit = (evt) => {
        evt.preventDefault();
        addEducation(formData, history)
    }

    return (
        <Fragment>
            <h1 class="large text-primary">
                Add Your Education
            </h1>
            <p class="lead">
                <i class="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form class="form" onSubmit={onSubmit}>
                <div class="form-group">
                <input
                    type="text"
                    placeholder="* School or Bootcamp"
                    name="school"
                    required
                    value={school}
                    onChange={onChange}
                />
                </div>
                <div class="form-group">
                <input
                    type="text"
                    placeholder="* Degree or Certificate"
                    name="degree"
                    required
                    value={degree}
                    onChange={onChange}
                />
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Field Of Study" name="fieldOfStudy" value={fieldOfStudy} onChange={onChange} required/>
                </div>
                <div class="form-group">
                <h4>From Date</h4>
                    <input type="date" name="from" value={from} onChange={onChange} />
                </div>
                <div class="form-group">
                <p>
                    <input type="checkbox" name="current" value={current} onChange={onChange} /> Current School or Bootcamp
                </p>
                </div>
                <div class="form-group">
                <h4>To Date</h4>
                    <input type="date" name="to" disabled={toDateDisabled ? 'disabled' : ''} value={to} onChange={onChange}/>
                </div>
                <div class="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Program Description"
                        value={description} 
                        onChange={onChange}
                    ></textarea>
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <Link class="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    );
};

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(AddEducation);