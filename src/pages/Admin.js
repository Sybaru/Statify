import { useState, useEffect } from "react";
import { getCurrentUserProfile, accessToken } from "../Spotify/spotify";
import { getUser } from "../Spotify/spotifyGen";
import { user, getAllUsers, getAllReviews } from "../mongo";
import { catchErrors } from "../utils";
import { UserGrid, SectionWrapper, ReviewList } from "../components";
export default function Admin() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mongoUser, setmongoUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    if (!accessToken) {
      window.location.href = `/`;
    }

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      if (data) {
        const data2 = await user(data.id);
        setmongoUser(data2);
        if (data2.Admin === false) {
          window.location.href = `/`;
        }
      }
      const data3 = await getAllUsers();
      setUsers(data3);

      const data4 = await getAllReviews();
      setReviews(data4);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <main>
      <SectionWrapper title="Users">
        <UserGrid users={users} />
      </SectionWrapper>
      <SectionWrapper title="All Reviews">
        <ReviewList reviews={reviews} />
      </SectionWrapper>
    </main>
  );
}
