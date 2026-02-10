import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  Box
} from "@mui/material";

function PollDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const res = await api.get(`/polls/${id}`);
      setPoll(res.data);
    } catch {
      alert("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {

    if (!selected) {
      return alert("Please select an option");
    }

    try {

      await api.post(`/polls/${id}/vote`, {
        optionId: selected
      });

      setVoted(true);

      // Navigate after vote (smooth UX)
      setTimeout(() => {
        navigate(`/results/${id}`);
      }, 800);

    } catch (err) {

      if (err.response?.status === 409) {
        alert("You already voted!");
      } else {
        alert("Voting failed");
      }

    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", borderRadius: 3 }}>
      <CardContent>

        <Typography variant="h5" gutterBottom>
          {poll.question}
        </Typography>

        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {poll.options.map(option => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
              disabled={voted}
            />
          ))}
        </RadioGroup>

        <Button
          variant="contained"
          onClick={handleVote}
          disabled={voted}
          sx={{ mt: 2 }}
        >
          Submit Vote
        </Button>

      </CardContent>
    </Card>
  );
}

export default PollDetail;
