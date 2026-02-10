import { AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function MainLayout({ children }) {

  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Mini Poll App
          </Typography>

          <Button color="inherit" onClick={() => navigate("/")}>
            Polls
          </Button>

          <Button color="inherit" onClick={() => navigate("/create")}>
            Create
          </Button>

        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ marginTop: 5 }}>

        {children}
      </Container>
    </>
  );
}

export default MainLayout;
