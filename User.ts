import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define the user schema
interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true }, // Only email is used as the unique identifier
  password: { type: String, required: true },
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
