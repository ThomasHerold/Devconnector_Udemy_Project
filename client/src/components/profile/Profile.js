import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import { getProfileById, clearProfile } from '../../actions/profile';
import { Link } from 'react-router-dom';

const Profile = ({ getProfileById, auth, profile: { profile, loading }, match, clearProfile }) => { 
    useEffect(() => {
        getProfileById(match.params.id);
        return () => clearProfile();
    }, [getProfileById, match, clearProfile])

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : 
            <Fragment>
                <Link to='/profiles' className="btn btn-light">
                    Back To Profiles
                </Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
                    <Link to='/edit-profile' className='btn btn-dark'>
                        Edit Profile
                    </Link>
                )}
                <div className="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />
                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {profile.experience.length > 0 ? (
                        <Fragment>
                            {profile.experience.map(experience => (
                                <ProfileExperience
                                    key={experience._id}
                                    experience={experience}
                                />
                            ))}
                        </Fragment>
                        ) : (<h4>No Experience Credentials</h4>)}
                    </div>
                    <div className="profile-edu bg-white p-2">
                        <h2 className="text-primary">Education</h2>
                        {profile.education.length > 0 ? (
                        <Fragment>
                            {profile.education.map(edu => (
                                <ProfileEducation
                                    key={edu._id}
                                    education={edu}
                                />
                            ))}
                        </Fragment>
                        ) : (<h4>No Education Credentials</h4>)}
                    </div>
                    {profile.githubusername && (
                        <ProfileGithub username={profile.githubusername} />
                    )}
                </div>
            </Fragment>
            }
        </Fragment>
    );
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    clearProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getProfileById, clearProfile })(Profile);