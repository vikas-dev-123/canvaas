import mongoose, { Schema, Model } from "mongoose";
import { Icon } from "../lib/enums";

/**
 * Plain interface (NO Document)
 * Prevents Next.js serialization issues
 */
export interface ISubAccountSidebarOption {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  link: string;
  icon: Icon;
  subAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubAccountSidebarOptionSchema = new Schema<ISubAccountSidebarOption>(
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
    subAccountId: {
      type: String,
      ref: "SubAccount",
      index: true,
    },
  },
  {
    timestamps: true,

    /**
     * Fix Next.js Server → Client serialization warnings
     */
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

/**
 * Optimized query index
 */
SubAccountSidebarOptionSchema.index({ subAccountId: 1 });

export const SubAccountSidebarOption: Model<ISubAccountSidebarOption> =
  mongoose.models.SubAccountSidebarOption ||
  mongoose.model<ISubAccountSidebarOption>(
    "SubAccountSidebarOption",
    SubAccountSidebarOptionSchema
  );
