import { BrowserRouter, Routes, Route } from "react-router-dom";

import PollList from "./pages/PollList";
import PollDetail from "./pages/PollDetail";
import CreatePoll from "./pages/CreatePoll";
import Results from "./pages/Results";

import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/results/:id" element={<Results />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
