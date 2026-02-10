import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PollList() {

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await api.get("/polls");

      
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPolls(sorted);

    } catch {
      alert("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!polls.length) {
  return <Typography>No active polls available.</Typography>;
}


  return (
    <Grid container spacing={3}>

      {polls.map(poll => (

         <Grid item xs={12} sm={6} md={4}>


          <Card
  sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 3,
    boxShadow: 3,
    transition: "0.3s",
    "&:hover": { boxShadow: 6 }
  }}
>

            <CardContent>

              <Typography variant="h6" gutterBottom>
                {poll.question}
              </Typography>

              <Box
  sx={{
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
    marginTop: 2
  }}
>
  <Button
    variant="outlined"
    onClick={() => navigate(`/poll/${poll.id}`)}
  >
    Vote
  </Button>

  <Button
    variant="contained"
    onClick={() => navigate(`/results/${poll.id}`)}
  >
    Results
  </Button>

  <Button
    color="error"
    variant="text"
    onClick={async () => {
      if (!window.confirm("Delete this poll?")) return;

      await api.delete(`/polls/${poll.id}`);
      fetchPolls();
    }}
  >
    Delete
  </Button>
</Box>



            </CardContent>
          </Card>

        </Grid>
      ))}

    </Grid>
  );
}

export default PollList;
