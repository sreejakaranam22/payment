const mongoose = require("mongoose");

const basicDetailsSchema = mongoose.Schema({
  // Full Name * [textbox]
  // fullname: {
  //   type: String,
  //   // required: true,
  //   minLength: 1,
  //   maxLength: 255,
  // },
  email: {
    type: String,
    // required: true,
    minLength: 1,
    maxLength: 255,
  },
  phone: {
    type: String,
    // required: true,
    minLength: 1,
    maxLength: 255,
  },
  city: {
    type: String,
    // required: true,
    minLength: 1,
    maxLength: 255,
  },
  age: {
    type: Number,
    // required: true,
    min: 1,
    max: 150,
  },
  gender: {
    type: String,
    // required: true,
    enum: ["male", "female", "other"],
  },
  profession: {
    type: String,
    required: true,
    maxLength: 255,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  // 10.What is your total household income? (₹ per annum) *
  // a. Less than ₹5,00,000
  // b. ₹5,00,00 - ₹10,00,000
  // c. ₹10,00,000 - ₹20,00,000
  // d. more than ₹20,00,000
  income: {
    type: String,
    // required: true,
    maxLength: 255,
  },
});

const familyHistorySchema = mongoose.Schema({
  // 11. Do you have a family history of any of the mentioned? [multiple options can be
  // selected]
  // a. Diabetes
  // b. Blood pressure
  // c. High Cholesterol
  // d. Hypothyroid
  // e. Cancer
  // f. Other:
  familyDiseases: {
    type: [String],
    required: true,
  },

  // 12.Do you have any of these conditions?[multiple options can be selected]
  // a. Asthma, bronchitis, cough with phlegm, pneumonia, pleurisy, sinusitis,
  // colds, congestion, sneezing
  // b. Dry cough, pharyngitis,
  // c. Acidity, nausea, vomit, stomach ulcers, headache, vertigo, skin issues
  // (psoriasis)
  // d. Gas bloating, distention
  // e. Constipation, incomplete evacuation
  // f. Diarrhoea, Ibs, ulcerative colitis
  // g. Recurrent fever
  // h. Diabetic, hypothyroid, overweight, high cholesterol/ lipids
  // i. Insomnia, inadequate sleep, high emotional stress, high fatigue
  familyConditions: {
    type: [String],
    required: true,
  },

  // 13.Do you have any known allergies?
  // a. Yes
  // b. No
  allergies: {
    type: [String],
    required: true,
  },

  // 14.Do you have any nutritional deficiencies? * [multiple options can be selected]
  // a. Vit A, B, C, E
  // b. Vit D
  // c. Vit B12
  // d. Calcium
  // e. Iron
  // f. None
  // g. Not aware
  // h. Others
  nutritionalDeficiencies: {
    type: [String],
    required: true,
  },
});

// ** LIFE STYLE **
// 15. Food Habits *
// a. Veg
// b. Non-veg
// c. Ovo-vegetarian (Eggs)
// d. Vegan

// 16. How would you describe your lifestyle? *

// a. Sedentary - tending to spend much time seated; somewhat inactive;
// couch or desk-bound
// b. Active - tending to move about frequently; go for walks; regularly
// running errands
// c. Hyperactive - regular exercise (5-7 hrs/week); play sports, cycling,
// swimming etc.

// 17. How has your sleep cycle been in the past 3 months? *
// a. Sound, peaceful and deep sleep (6-8 hrs)
// b. Disturbed, interrupted, and light sleep (less than 6 hrs)
// c. Excessive, prolonged, and includes day sleep (more than 8 hrs)

// 18. Do you have any of the following as a regular habit? Select all that apply. *
// [multiple options can be selected]
// a. Smoking
// b. Drinking
// c. Tobacco in any form
// d. Digital gadgets
// e. Any form of food or soft drinks (Eg. Sugar, Fast food, Beverages)
// f. None
// g. Other:

const lifeStyleSchema = mongoose.Schema({
  foodHabits: {
    type: String,
    required: true,
  },
   lifestyleDesc: {
   type: String,
  //   required: true,
 },
  problem: {
    type: String,
    required: true,
  },
  sleepCycle: {
    type: String,
    required: true,
  },
  regularHabits: {
    type: [String],
    required: true,
  },
  physicalactivity: {
    type: String,
    required: true,
  },
  wakeupenergylevel: {
     type: Number,
    // required: true,
  },
  postmealenergylevel: {
    type: Number,
    // required: true,
  },
  nervous: {
    type: String,
    required: true,
  },
  worrying: {
    type: String,
    required: true,
  },
});

// 19. Which of these best describes your mood lately? *

// a. Depressed, Gloomy, Lonely, Low, Sad, Dull, Lazy, Unenthusiastic
// b. Angry, Aggressive, Highly Excited, Charged
// c. Highly Optimistic, Happy, Fresh, Serene, Calm

// 20. How do you respond to a bad experience? *

// a. Your immediate response is impulsive(React loudly, argue, lash out,
// snap, curse your luck/life)
// b. You feel bad, but react moderately and try to hold your temper to focus
// on what needs to be done
// c. You tend to get focused, do not take things personally, try to solve the
// issue and focus on navigating the situation.
// 21. Which of these challenges do you face often? *

// a. Difficulty in learning/understanding/focusing on a new concept
// b. Retaining things that you have recently learned/understood
// c. Recalling names of people or incidents
// 22. How would you describe your learning pattern? *

// a. Quick to learn but I can soon forget. I like to study many things but
// have difficulty retaining focus. I learn faster by listening.
// b. I am well-organised, focused, and goal-oriented, I learn best by
// reading and with visuals.
// c. I don't learn as quickly as some people, but I have excellent retention
// and a long memory.
const stateOfMindSchema = mongoose.Schema({
  mood: {
     type: String,
  //   required: true,
   },
   responseBadExperience: {
    type: String,
  //   required: true,
 },
  challanges: {
    type: String,
    required: true,
  },
  learningPattern: {
    type: String,
    required: true,
  },
});

// 23. How will you describe your body frame? *

// a. Slim, light frame and tall or short and bony

// b. Medium, average development
// c. Well-developed body, larger curvy frames, stocky, stout, wide

// 24. How would you best describe your body temperature? *
// a. I feel cold easily and am usually cold to touch
// b. I feel hot easily and am usually warm to touch
// c. I sweat easily and can feel damp or moist to touch

// 25. What is the closest description of your sweat? *

// a. Odourless, scanty
// b. Strong smell, profuse, hot
// c. Pleasant smell, moderate when exercising, cold

// 26. How would you describe your metabolism? *
// a. Fast metabolism, difficult to gain weight
// b. Balanced metabolism, can gain weight and lose weight easily
// c. Slow metabolism, difficult to lose weight
// 27. How would you describe your appetite? *

// a. Erratic - I am an irregular eater with fluctuating appetite and habits
// b. Strong – I like to eat regularly and can become irritable when hungry
// c. Moderate but steady- I am often not hungry till mid-morning

// 28. How would you describe your faeces (stool)? *

// a. Dry, hard, scanty, painful or difficult, gas (constipation)
// b. Bulk quantity, at times unformed, yellowish, burning (diarrhoea)
// c. Moderate, solid, pale, mucous in the stool (if constipated stools are still
// soft)
const bodyConstitutionSchema = mongoose.Schema({
  bodyframe: {
    type: String,
    required: true,
  },
  bodyTemperature: {
    type: String,
    required: true,
  },
  sweat: {
    type: String,
    required: true,
  },
  metabolism: {
    type: String,
    required: true,
  },
  appetite: {
    type: String,
    required: true,
  },
  faeces: {
    type: String,
    required: true,
  },
});

const questionnaireSchema = mongoose.Schema({
  kit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  basicDetails: basicDetailsSchema,
  familyHistory: familyHistorySchema,
  lifeStyle: lifeStyleSchema,
  stateOfMind: stateOfMindSchema,
  bodyConstitution: bodyConstitutionSchema,
});

module.exports = mongoose.model(
  "questionnaire",
  questionnaireSchema,
  "Questionnaire"
);
