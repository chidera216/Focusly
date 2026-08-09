import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    mode: {
      type: String,
      enum: ["focus", "short-break", "long-break"],
      default: "focus",
    },

    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Session", sessionSchema);
