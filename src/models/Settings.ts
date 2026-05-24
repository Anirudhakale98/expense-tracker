import mongoose, { Schema, Types, models, model } from "mongoose";

export interface ISettings {
  userId: Types.ObjectId;
  salaryDay: number;
  monthlySalary: number;
  customHolidays: string[];
  currency: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    salaryDay: { type: Number, default: 26, min: 1, max: 28 },
    monthlySalary: { type: Number, default: 0, min: 0 },
    customHolidays: { type: [String], default: [] },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

export const Settings =
  models.Settings ?? model<ISettings>("Settings", SettingsSchema);

export async function getOrCreateSettings(userId: string) {
  let doc = await Settings.findOne({ userId });
  if (!doc) {
    const defaultSalary = Number(process.env.DEFAULT_SALARY) || 0;
    doc = await Settings.create({
      userId,
      salaryDay: 26,
      monthlySalary: defaultSalary,
      customHolidays: [],
      currency: "INR",
    });
  }
  return doc;
}
