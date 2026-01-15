import mongoose, { Schema, Model } from "mongoose";

export interface IAddOns {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  active: boolean;
  priceId: string;
  agencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddOnsSchema = new Schema<IAddOns>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    priceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    agencyId: {
      type: String,
      ref: "Agency",
      index: true,
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

export const AddOns: Model<IAddOns> =
  mongoose.models.AddOns || mongoose.model<IAddOns>("AddOns", AddOnsSchema);
