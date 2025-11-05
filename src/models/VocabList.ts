import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVocabList extends Document {
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  vocabularyCount: number;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VocabListSchema = new Schema<IVocabList>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vocabularyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

VocabListSchema.index({ slug: 1 }, { unique: true });
VocabListSchema.index({ isActive: 1 });

export default mongoose.models.VocabList ||
  mongoose.model<IVocabList>("VocabList", VocabListSchema);
