import React from 'react';
import formatDate from '../../utils/formatDate';
import PropTypes from 'prop-types';

const ProfileEducation = ({ education: {school, degree, fieldOfStudy, current, to, from, description} }) => {
    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>
                {formatDate(from)} - {to ? formatDate(to) : 'Now'}
            </p>
            <p>
                <strong>Position: </strong> {degree}
            </p>
            <p>
                <strong>Field of Study: </strong> {fieldOfStudy}
            </p>
            <p>
                <strong>Description: </strong> {description}
            </p>
        </div>
    );
};

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
};

export default ProfileEducation;