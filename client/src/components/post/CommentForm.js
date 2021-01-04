import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
    const [text, setText] = useState('');

    const handleSubmit = (evt) => {
        evt.preventDefault();
        addComment(postId, { text });
        setText('');
    }

    const handleChange = (evt) => {
        setText(evt.target.value)
    }

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Leave a Comment</h3>
            </div>
        <form className="form my-1" onSubmit={handleSubmit}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            value={text}
            required
            onChange={handleChange}
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    postId: PropTypes.number.isRequired
};

export default connect(null, { addComment })(CommentForm);