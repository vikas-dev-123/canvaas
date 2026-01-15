import mongoose, { Schema, Model } from "mongoose";
import { Icon } from "../lib/enums";

export interface IAgencySidebarOption {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  link: string;
  icon: Icon;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgencySidebarOptionSchema = new Schema<IAgencySidebarOption>(
  {
    name: {
      type: String,
      default: "Menu",
      trim: true,
    },
    link: {
      type: String,
      default: "#",
      trim: true,
    },
    icon: {
      type: String,
      enum: Object.values(Icon),
      default: Icon.info,
    },
    agencyId: {
      type: String,
      ref: "Agency",
      required: true,
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

export const AgencySidebarOption: Model<IAgencySidebarOption> =
  mongoose.models.AgencySidebarOption ||
  mongoose.model<IAgencySidebarOption>(
    "AgencySidebarOption",
    AgencySidebarOptionSchema
  );
