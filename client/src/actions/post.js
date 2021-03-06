import api from '../utils/api';
import formatDate from '../utils/formatDate';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types';


// Get posts

export const getPosts = () => async dispatch => {
    try {
        const res = await api.get('/posts');

        dispatch({ type: GET_POSTS, payload: res.data })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add Like

export const addLike = postId => async dispatch => {
    try {
      const res = await api.put(`/posts/like/${postId}`);
  
      dispatch({
        type: UPDATE_LIKES,
        payload: { id: postId, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
};

// Remove Like

export const removeLike = postId => async dispatch => {
    try {
      const res = await api.put(`/posts/unlike/${postId}`);
  
      dispatch({
        type: UPDATE_LIKES,
        payload: { id: postId, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
};

// Delete Post

export const deletePost = (postId) => async dispatch => {
    try {
       await api.delete(`/posts/${postId}`);

        dispatch({ type: DELETE_POST, payload: { id: postId } });
        dispatch(setAlert('Post Removed', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
};

// Add Post

export const addPost = (formData) => async dispatch => {
    try {
        const res = await api.post(`/posts`, formData);

        dispatch({ type: ADD_POST, payload: res.data });
        dispatch(setAlert('Post Created', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
};

// Get a single post

export const getSinglePost = (id) => async dispatch => {
  try {
      const res = await api.get(`/posts/${id}`);

      dispatch({ type: GET_POST, payload: res.data })
  } catch (err) {
      dispatch({
          type: POST_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
      });
  }
};

// Add Comment

export const addComment = (postId, formData) => async dispatch => {
  try {
      const res = await api.post(`/posts/comment/${postId}`, formData);

      dispatch({ type: ADD_COMMENT, payload: res.data });
      dispatch(setAlert('Comment Added', 'success'));

  } catch (err) {
      dispatch({
          type: POST_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
  }
};

// Delete Comment

export const deleteComment = (postId, commentId) => async dispatch => {
  try {
     await api.delete(`/posts/comment/${postId}/${commentId}`);

      dispatch({ type: REMOVE_COMMENT, payload: commentId });
      dispatch(setAlert('Comment Added', 'success'));

  } catch (err) {
      dispatch({
          type: POST_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
  }
};

