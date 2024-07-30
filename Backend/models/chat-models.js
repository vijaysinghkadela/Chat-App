import mongoose, { Schema,  model,  } from "mongoose";

const Schema = new Schema(
  {
    name: {
      type: string,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creater: {
      type: Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.models.Chat || model("Chat", Schema);
