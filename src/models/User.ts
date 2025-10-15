import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  level: "beginner" | "intermediate" | "advanced";
  goals: string;
  progress?: mongoose.Types.ObjectId;
  streak: number;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    language: string;
    notifications: boolean;
    difficulty: "easy" | "medium" | "hard";
  };
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    goals: {
      type: String,
      default: "Improve my English skills",
      maxlength: [200, "Goals cannot be more than 200 characters"],
    },
    progress: {
      type: Schema.Types.ObjectId,
      ref: "Progress",
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      language: {
        type: String,
        default: "vi",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ level: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
