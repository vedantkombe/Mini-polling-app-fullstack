import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  CircularProgress
} from "@mui/material";

function Results() {

  const { id } = useParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/polls/${id}/results`);
      setResults(res.data);
    } catch {
      alert("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!results.length) {
  return <Typography>No votes yet.</Typography>;
}


  return (
    <Card sx={{ maxWidth: 700, margin: "auto", borderRadius: 3 }}>
      <CardContent>

        <Typography variant="h5" gutterBottom>
          Poll Results
        </Typography>

        {results.map((r, index) => (

          <Box key={index} sx={{ mb: 3 }}>

            <Typography sx={{ mb: 1 }}>
              {r.text} — {r.votes} votes ({r.percentage}%)
            </Typography>

            <LinearProgress
              variant="determinate"
              value={Number(r.percentage)}
              sx={{
                height: 10,
                borderRadius: 5
              }}
            />

          </Box>
        ))}

      </CardContent>
    </Card>
  );
}

export default Results;
