import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    actorId: {
      type: String,
      default: "",
      trim: true,
    },
    actorRole: {
      type: String,
      default: "",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
  },
);

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    taskDescription: {
      type: String,
      required: true,
      trim: true,
    },
    taskDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "active", "complete", "failed"],
      default: "new",
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    review: {
      type: reviewSchema,
      default: null,
    },
    activityLog: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ assignedTo: 1, status: 1, priority: 1, taskDate: 1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
