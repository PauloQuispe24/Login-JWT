import mongoose, { Schema } from "mongoose";

interface IUser {
  email: string;
  passwordHash: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
