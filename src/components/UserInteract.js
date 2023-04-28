import { changeUserAdmin } from "../mongo";
import { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const UserInteract = ({ mongoUser }) => {
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const handleClick = (e) => {
    setAdmin(e.target.checked);
    changeUserAdmin(user);
    setUser({ ...user, admin: e.target.checked });
  };

  useEffect(() => {
    setUser(mongoUser);
    setAdmin(mongoUser.admin);
  }, [mongoUser]);

  return (
    <>
      <FormControlLabel
        className="track__item__name"
        value="Admin: "
        labelPlacement="start"
        label="Admin: "
        control={
          <Checkbox
            checked={admin}
            onChange={(e) => {
              handleClick(e);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />
    </>
  );
};

export default UserInteract;
