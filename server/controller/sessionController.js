import Session from "../model/Session.js";

export const createSession = async (req, res) => {
  try {
    const { mode, duration, date, task } = req.body;

    const sessionDate = date || new Date().toISOString().split("T")[0];

    const session = await Session.create({
      user: req.userId,
      task: task || null,
      mode,
      duration,
      date: sessionDate,
    });

    res.status(201).json({
      success: true,
      message: "Session saved successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const totalMinutes = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const sessions = await Session.find({
      user: req.userId,
      date: today,
    });

    const totalMinutes = sessions.reduce(
      (total, session) => total + session.duration,
      0,
    );

    res.json({ totalMinutes });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const { range } = req.params;

    const today = new Date();

    let startDate;
    let endDate;

    if (range === "today") {
      startDate = new Date(today);
      endDate = new Date(today);
    } else if (range === "week") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);

      endDate = new Date(today);
    } else if (range === "month") {
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);

      endDate = new Date(today);
    } else if (range === "year") {
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);

      endDate = new Date(today);
    } else {
      return res.status(400).json({
        message: "Invalid range",
      });
    }

    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    const sessions = await Session.find({
      user: req.userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).populate("task", "title");

    const totalMinutes = sessions.reduce(
      (total, session) => total + session.duration,
      0,
    );

    const taskStats = {};

    sessions.forEach((session) => {
      if (!session.task) return;

      const taskId = session.task._id.toString();

      if (!taskStats[taskId]) {
        taskStats[taskId] = {
          taskId,
          title: session.task.title,
          totalMinutes: 0,
        };
      }

      taskStats[taskId].totalMinutes += session.duration;
    });

    res.json({
      range,
      start,
      end,
      totalMinutes,
      taskStats: Object.values(taskStats),
    });
  } catch (error) {
    console.error("Stats error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
