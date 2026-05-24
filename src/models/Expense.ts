import mongoose, { Schema, Types, models, model } from "mongoose";
import type { CategoryType, FoodSubType, Sector } from "@/lib/categories";

export interface IExpense {
  userId: Types.ObjectId;
  amount: number;
  category: CategoryType;
  sector: Sector;
  foodSubType?: FoodSubType;
  note?: string;
  date: Date;
  periodStart: Date;
  periodEnd: Date;
  periodLabel: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["need", "wants", "investment"],
    },
    sector: { type: String, required: true },
    foodSubType: {
      type: String,
      enum: ["essential", "discretionary"],
    },
    note: { type: String, maxlength: 500 },
    date: { type: Date, required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    periodLabel: { type: String, required: true },
  },
  { timestamps: true }
);

ExpenseSchema.index({ userId: 1, periodStart: 1, periodEnd: 1 });
ExpenseSchema.index({ userId: 1, date: -1 });

export const Expense =
  models.Expense ?? model<IExpense>("Expense", ExpenseSchema);
