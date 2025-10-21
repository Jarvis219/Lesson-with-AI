import mongoose, { Document, Schema } from "mongoose";

export interface IPaymentMethod {
  _id?: mongoose.Types.ObjectId;
  bankName: string;
  accountHolderName: string;
  bankAccount: string;
  paymentMethod: string;
  isPrimary: boolean;
}

export interface ITeacherPaymentInfo extends Document {
  teacherId: mongoose.Types.ObjectId;
  paymentMethods: IPaymentMethod[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
      maxlength: [100, "Bank name cannot be more than 100 characters"],
    },
    accountHolderName: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
      maxlength: [
        100,
        "Account holder name cannot be more than 100 characters",
      ],
      match: [
        /^[a-zA-Z\s]+$/,
        "Account holder name should only contain letters and spaces",
      ],
    },
    bankAccount: {
      type: String,
      required: [true, "Bank account number is required"],
      trim: true,
      minlength: [8, "Bank account number must be at least 8 characters"],
      maxlength: [20, "Bank account number cannot be more than 20 characters"],
      match: [/^[0-9]+$/, "Bank account number should only contain numbers"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true,
      maxlength: [50, "Payment method cannot be more than 50 characters"],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true, timestamps: true }
);

const TeacherPaymentInfoSchema = new Schema<ITeacherPaymentInfo>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher ID is required"],
      unique: true,
      index: true,
    },
    paymentMethods: {
      type: [PaymentMethodSchema],
      validate: {
        validator: function (methods: IPaymentMethod[]) {
          return methods.length <= 3;
        },
        message: "Maximum 3 payment methods allowed",
      },
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
TeacherPaymentInfoSchema.index({ teacherId: 1, isActive: 1 });

// Ensure one active payment info per teacher
TeacherPaymentInfoSchema.index(
  { teacherId: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.models.TeacherPaymentInfo ||
  mongoose.model<ITeacherPaymentInfo>(
    "TeacherPaymentInfo",
    TeacherPaymentInfoSchema
  );
