import mongoose, { Document, Schema } from "mongoose";

export interface IScheduleSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ITeacherSchedule extends Document {
  teacherId: mongoose.Types.ObjectId;
  schedule: IScheduleSlot[];
  timezone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSlotSchema = new Schema<IScheduleSlot>(
  {
    day: {
      type: String,
      required: [true, "Day is required"],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time format"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time format"],
    },
  },
  { _id: false }
);

const TeacherScheduleSchema = new Schema<ITeacherSchedule>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher ID is required"],
      unique: true,
      index: true,
    },
    schedule: {
      type: [ScheduleSlotSchema],
      required: [true, "Schedule is required"],
      validate: {
        validator: function (schedule: IScheduleSlot[]) {
          return schedule.length > 0;
        },
        message: "Schedule must have at least one slot",
      },
    },
    timezone: {
      type: String,
      default: "Asia/Ho_Chi_Minh",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
TeacherScheduleSchema.index({ teacherId: 1, isActive: 1 });

// Ensure one active schedule per teacher
TeacherScheduleSchema.index(
  { teacherId: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.models.TeacherSchedule ||
  mongoose.model<ITeacherSchedule>("TeacherSchedule", TeacherScheduleSchema);
