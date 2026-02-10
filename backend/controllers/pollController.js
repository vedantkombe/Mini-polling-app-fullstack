const api = require("../services/api");



exports.getAllPolls = async (req, res) => {
  try {
    const polls = await api.get("/polls?isActive=true");
    res.json(polls.data);
  } catch {
    res.status(500).json({ message: "Error fetching polls" });
  }
};



exports.getPollDetails = async (req, res) => {
  try {
    const pollId = req.params.id;

    const poll = await api.get(`/polls/${pollId}`);
    const options = await api.get(`/options?pollId=${pollId}`);

    res.json({
      ...poll.data,
      options: options.data
    });

  } catch {
    res.status(500).json({ message: "Error fetching poll" });
  }
};



exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || options.length < 2) {
      return res.status(400).json({
        message: "Question and at least 2 options required"
      });
    }

    const pollRes = await api.post("/polls", {
      question,
      isActive: true,
      createdAt: new Date()
    });

    const pollId = pollRes.data.id;

    const optionPromises = options.map(opt =>
      api.post("/options", {
        pollId,
        text: opt,
        votes: 0
      })
    );

    await Promise.all(optionPromises);

    res.status(201).json({ message: "Poll created!" });

  } catch {
    res.status(500).json({ message: "Error creating poll" });
  }
};


exports.votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { optionId } = req.body;

    const userIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const existingVote = await api.get(
      `/votes?pollId=${pollId}&userIp=${userIp}`
    );

    if (existingVote.data.length) {
      return res.status(409).json({
        message: "You already voted"
      });
    }

    const optionRes = await api.get(`/options/${optionId}`);

    await api.patch(`/options/${optionId}`, {
      votes: optionRes.data.votes + 1
    });

    await api.post("/votes", {
      pollId,
      optionId,
      userIp
    });

    res.json({ message: "Vote recorded!" });

  } catch {
    res.status(500).json({ message: "Voting failed" });
  }
};

exports.getResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    const options = await api.get(`/options?pollId=${pollId}`);

    const totalVotes = options.data.reduce(
      (sum, o) => sum + o.votes,
      0
    );

    const results = options.data.map(o => ({
      text: o.text,
      votes: o.votes,
      percentage: totalVotes
        ? ((o.votes / totalVotes) * 100).toFixed(1)
        : 0
    }));

    res.json(results);

  } catch {
    res.status(500).json({ message: "Error fetching results" });
  }
};



exports.deletePoll = async (req, res) => {
  try {

    const pollId = req.params.id;

    
    await api.delete(`/polls/${pollId}`);

    
    const options = await api.get(`/options?pollId=${pollId}`);

    await Promise.all(
      options.data.map(opt =>
        api.delete(`/options/${opt.id}`)
      )
    );

    
    const votes = await api.get(`/votes?pollId=${pollId}`);

    await Promise.all(
      votes.data.map(vote =>
        api.delete(`/votes/${vote.id}`)
      )
    );

    res.json({ message: "Poll deleted successfully" });

  } catch {
    res.status(500).json({ message: "Failed to delete poll" });
  }
};
