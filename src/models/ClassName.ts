import mongoose, { Schema, Model } from "mongoose";

export interface IClassName {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  color: string;
  funnelId: string;
  customData?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassNameSchema = new Schema<IClassName>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    funnelId: {
      type: String,
      ref: "Funnel",
      required: true,
      index: true,
    },
    customData: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...result } = ret;
        result.id = result.id ?? _id?.toString();
        return result;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...result } = ret;
        result.id = result.id ?? _id?.toString();
        return result;
      },
    },
  }
);

export const ClassName: Model<IClassName> =
  mongoose.models.ClassName ||
  mongoose.model<IClassName>("ClassName", ClassNameSchema);
