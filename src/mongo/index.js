import axios from "axios";

export const API_BASE = "https://statify-back.vercel.app";

const makeUser = async (spotify) => {
  const user = await axios
    .post(API_BASE + "/api/makeusers", {
      spotify: spotify,
      admin: false,
    })
    .then((res) => {
      return res.data;
    });
  return user;
};

export const user = async (spotify) => {
  const res = await axios.get(API_BASE + `/api/users/${spotify}`);
  if (res.data === null) {
    const user = await makeUser(spotify);
    return user;
  } else {
    return res.data;
  }
};

export const getAllUsers = async () => {
    const users = await axios.get(API_BASE + "/api/users").then((res) => {
        return res.data;
    });
    return users;
}

export const changeUserAdmin = async (mongoUser) => {
  const user = await axios
    .put(API_BASE + "/api/users/admin", {
      spotify: mongoUser.spotify,
      admin: !mongoUser.admin,
    })
    .then((res) => {
      return res.data;
    });
  return user;
};

export const getAllReviews = async () => {
  const reviews = await axios.get(API_BASE + "/api/reviews").then((res) => {
    return res.data;
  });
  return reviews;
};

export const getUserReviews = async (spotify) => {
  const reviews = await axios
    .get(API_BASE + `/api/reviews/${spotify}`)
    .then((res) => {
      return res.data;
    });
  return reviews;
};

export const getItemReviews = async (reviewId, type) => {
  if (type === "track") {
  const review = await axios
    .get(API_BASE + `/api/trackreviews/${reviewId}`)
    .then((res) => {
      return res.data;
    });
  return review;
  } else if (type === "album") {
    const review = await axios
    .get(API_BASE + `/api/albumreviews/${reviewId}`)
    .then((res) => {
      return res.data;
    });
  return review;
  }
  return null;
};

export const makeNewReview = async (review) => {
  const newReview = await axios
    .post(API_BASE + "/api/reviews", review)
    .then((res) => {
      return res.data;
    });
  return newReview;
};

export const deleteReview = async (reviewId) => {
  const deletedReview = await axios
    .delete(API_BASE + `/api/deletereviews/${reviewId}`)
    .then((res) => {
      return res.data;
    });
  return deletedReview;
};

export const editReview = async (review, reviewId) => {
  const editedReview = await axios
    .put(API_BASE + `/api/editreviews/${reviewId}`, review)
    .then((res) => {
      return res.data;
    });
  return editedReview;
};
