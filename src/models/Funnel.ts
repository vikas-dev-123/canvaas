import mongoose, { Schema, Model } from "mongoose";

export interface IFunnel {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  subAccountId: string;
  description?: string;
  published: boolean;
  subDomainName?: string;
  favicon?: string;
  liveProducts: string; // JSON string (kept for compatibility)
  createdAt: Date;
  updatedAt: Date;
}

const FunnelSchema = new Schema<IFunnel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subAccountId: {
      type: String,
      ref: "SubAccount",
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    subDomainName: {
      type: String,
      unique: true,
      sparse: true, // important for optional unique field
      trim: true,
      index: true,
    },
    favicon: {
      type: String,
    },
    liveProducts: {
      type: String,
      default: "[]",
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

export const Funnel: Model<IFunnel> =
  mongoose.models.Funnel ||
  mongoose.model<IFunnel>("Funnel", FunnelSchema);
