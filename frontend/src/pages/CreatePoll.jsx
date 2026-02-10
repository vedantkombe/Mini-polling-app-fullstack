import { useState } from "react";
import api from "../services/api";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box
} from "@mui/material";

function CreatePoll() {

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {

    if (options.length <= 2) return;

    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const handleSubmit = async () => {

    if (!question.trim()) {
      return alert("Question is required");
    }

    if (options.some(opt => !opt.trim())) {
      return alert("All options must be filled");
    }

    try {

      await api.post("/polls", {
        question,
        options
      });

      alert("Poll created successfully!");

      window.location.href = "/";


      // reset form
      setQuestion("");
      setOptions(["", ""]);

    } catch (err) {
      alert("Failed to create poll");
    }
      
    
  };

  return (
    <Card sx={{ maxWidth: 700, margin: "auto", borderRadius: 3 }}>
      <CardContent>

        <Typography variant="h5" gutterBottom>
          Create New Poll
        </Typography>

        <TextField
          fullWidth
          label="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{ mb: 3 }}
        />

        {options.map((opt, index) => (

          <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>

            <TextField
              fullWidth
              label={`Option ${index + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(e.target.value, index)
              }
            />

            <Button
              variant="outlined"
              color="error"
              onClick={() => removeOption(index)}
            >
              X
            </Button>

          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={addOption}
          sx={{ mr: 2 }}
        >
          Add Option
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Create Poll
        </Button>

      </CardContent>
    </Card>
  );
}

export default CreatePoll;
