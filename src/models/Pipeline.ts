import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Next.js Server → Client safe
 */
export interface IPipeline {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineSchema = new Schema<IPipeline>(
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
  },
  {
    timestamps: true,

    /**
     * Fix Next.js serialization issues
     * Convert _id → id
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
 * Helpful compound index
 * Fast queries per subaccount
 */
PipelineSchema.index({ subAccountId: 1, createdAt: -1 });

export const Pipeline: Model<IPipeline> =
  mongoose.models.Pipeline ||
  mongoose.model<IPipeline>("Pipeline", PipelineSchema);
