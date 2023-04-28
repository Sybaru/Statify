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
import { makeNewReview } from "../mongo";
import { getCurrentUserProfile, accessToken } from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { useEffect, useState } from "react";

export default function MakeReview(type, item) {
  const id = item.id;
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [profile, setProfile] = useState(null);
  const [reviewText, setReviewText] = useState(null);

  const handleChange = (e) => {
    setReviewText(e.target.value);
  };

  useEffect(() => {
    setToken(accessToken);
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
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
    review.type = type;
    review.user = profile.id;
    review.reviewedId = item.id;
    review.review = reviewText;
    makeNewReview(review);
    setOpen(false);
    window.location.reload(false);
  };

  return (
    <>
      {token && profile ? (
        <div>
          <Button variant="outlined" onClick={handleClickOpen}>
            Write a Review
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
