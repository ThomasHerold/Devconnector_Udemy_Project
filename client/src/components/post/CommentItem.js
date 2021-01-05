import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/post';
import formatDate from '../../utils/formatDate';

const CommentItem = ({ postId, auth, deleteComment, comment: { _id, text, name, avatar, user, date } }) => {
    const handleClick = () => {
        deleteComment(postId, _id);
    };

    return (
        <div class="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img
              class="round-img"
              src={avatar}
              alt="profile-img"
            />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p class="my-1">
           {text}
          </p>
           <p class="post-date">
              Posted on {formatDate(date)}
          </p>
          {!auth.loading && user === auth.user._id && (
            <button onClick={handleClick} type="button" className="btn btn-danger">
                <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
    );
};

CommentItem.propTypes = {
    auth: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem);