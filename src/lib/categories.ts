export type CategoryType = "need" | "wants" | "investment";

export type Sector =
  | "food"
  | "entertainment"
  | "transport"
  | "utilities"
  | "housing"
  | "health"
  | "shopping"
  | "subscriptions"
  | "education"
  | "other";

export type FoodSubType = "essential" | "discretionary";

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  need: "Need",
  wants: "Wants",
  investment: "Investment",
};

export const SECTOR_LABELS: Record<Sector, string> = {
  food: "Food",
  entertainment: "Entertainment",
  transport: "Transport",
  utilities: "Utilities",
  housing: "Housing",
  health: "Health",
  shopping: "Shopping",
  subscriptions: "Subscriptions",
  education: "Education",
  other: "Other",
};

export const FOOD_SUB_LABELS: Record<FoodSubType, string> = {
  essential: "Daily / Mess (Need)",
  discretionary: "Outing / Cafes (Wants)",
};

/** Sectors available per category */
export const SECTORS_BY_CATEGORY: Record<CategoryType, Sector[]> = {
  need: [
    "food",
    "transport",
    "utilities",
    "housing",
    "health",
    "subscriptions",
    "education",
    "other",
  ],
  wants: [
    "food",
    "entertainment",
    "transport",
    "shopping",
    "subscriptions",
    "other",
  ],
  investment: ["other"],
};

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  need: "#3b82f6",
  wants: "#f59e0b",
  investment: "#10b981",
};

export function getFoodSubType(category: CategoryType): FoodSubType | undefined {
  if (category === "need") return "essential";
  if (category === "wants") return "discretionary";
  return undefined;
}
