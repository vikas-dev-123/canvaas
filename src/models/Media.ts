import mongoose, { Schema, Model } from "mongoose";

export interface IMedia {
  id: string;
  _id?: string;
  __v?: number;
  type?: string;
  name: string;
  link: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    type: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ searchable but NOT globally unique
    },
    subAccountId: {
      type: String,
      ref: "SubAccount",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        const result = { ...ret };
        result.id = result.id ?? ret._id?.toString();
        if (result._id) delete (result as any)._id;
        if (result.__v) delete (result as any).__v;
        return result;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        const result = { ...ret };
        result.id = result.id ?? ret._id?.toString();
        if (result._id) delete (result as any)._id;
        if (result.__v) delete (result as any).__v;
        return result;
      },
    },
  }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
