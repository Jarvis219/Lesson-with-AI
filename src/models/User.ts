import mongoose, { Document, Schema } from "mongoose";

export const USER_ROLES = ["student", "teacher", "admin"] as const;

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  passwordHash: string;
  role: (typeof USER_ROLES)[number];
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
  // Teacher specific fields
  isTeacherApproved?: boolean;
  teacherBio?: string;
  teacherQualification?: string;
  coursesCreated?: mongoose.Types.ObjectId[];
  // Student specific fields
  enrolledCourses?: mongoose.Types.ObjectId[];
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
    avatar: {
      type: String,
      required: [false, "Avatar is not required"],
      default: null,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
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
    // Teacher specific fields
    isTeacherApproved: {
      type: Boolean,
      default: false,
    },
    teacherBio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    teacherQualification: {
      type: String,
      maxlength: [200, "Qualification cannot be more than 200 characters"],
    },
    coursesCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ level: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
