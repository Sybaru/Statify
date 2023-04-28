import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { user, deleteReview, editReview } from "../mongo";
import { getCurrentUserProfile, accessToken } from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { useEffect, useState } from "react";

export default function ReviewItemActions({editedReview}) {
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(editedReview.liked);
  const [profile, setProfile] = useState(null);
  const [reviewText, setReviewText] = useState(editedReview.review);
  const [canEdit, setCanEdit] = useState(false);
  const [mongoUser, setMongoUser] = useState(null);

  const handleChange = (e) => {
    setReviewText(e.target.value);
  };

  useEffect(() => {
    setToken(accessToken);
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      const mongoUser = await user(data.id);
      setMongoUser(mongoUser);
      if (mongoUser.admin === true || mongoUser.spotify === editedReview.id) {
        setCanEdit(true);
      }
    };
    catchErrors(fetchData());
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (e) => {
    setLiked(e.target.checked);
  };

  const handleSubmit = () => {
    const review = {};
    review.liked = liked;
    review.type = editedReview.type;
    review.user = profile.id;
    review.reviewedId = editedReview.id;
    review.review = reviewText;
    review._id = editedReview._id;
    editReview(review, review._id);
    setOpen(false);
    window.location.reload(false);
  };

  const handleDelete = () => {
    deleteReview(editedReview._id);
    setOpen(false);
    window.location.reload(false);
  };

  return (
    <>
      {token && profile && canEdit === true ? (
        <div>
          <Button variant="outlined" onClick={handleClickOpen}>
            Edit or Delete Review
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Review</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Review"
                type="email"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <FormControlLabel
                className="track__item__name"
                value="Recommend? "
                labelPlacement="start"
                label="Recommend? "
                control={
                  <Checkbox
                    checked={liked}
                    onChange={(e) => {
                      handleClick(e);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelete}>Delete</Button>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
