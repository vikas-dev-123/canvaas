import mongoose, { Schema, Model } from "mongoose";

export interface IFunnelPage {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  pathName: string;
  funnelId: string;
  visits: number;
  content?: string;
  order: number;
  previewImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FunnelPageSchema = new Schema<IFunnelPage>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pathName: {
      type: String,
      default: "",
      trim: true,
    },
    funnelId: {
      type: String,
      ref: "Funnel",
      required: true,
      index: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
    previewImage: {
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

// 🔥 Important: ordering optimization
FunnelPageSchema.index({ funnelId: 1, order: 1 });

export const FunnelPage: Model<IFunnelPage> =
  mongoose.models.FunnelPage ||
  mongoose.model<IFunnelPage>("FunnelPage", FunnelPageSchema);
