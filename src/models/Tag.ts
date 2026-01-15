import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Prevents Next.js serialization issues
 */
export interface ITag {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  color: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
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
    subAccountId: {
      type: String,
      ref: "SubAccount",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,

    /**
     * Fix Next.js Server → Client serialization
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
 * Prevent duplicate tag names per subaccount
 */
TagSchema.index(
  { subAccountId: 1, name: 1 },
  { unique: true }
);

export const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
