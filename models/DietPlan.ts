import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: [String],
});

const mealSchema = new mongoose.Schema({
  time: String,
  items: [String],
  herbs: [String],
  recipe: recipeSchema,
});

const dailyPlanSchema = new mongoose.Schema({
  day: String,
  meals: [mealSchema],
  remedies: [String],
});

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  dailyPlans: [dailyPlanSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const DietPlan = mongoose.models.DietPlan || mongoose.model('DietPlan', dietPlanSchema);