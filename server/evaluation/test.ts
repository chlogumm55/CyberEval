import { evaluate } from "./evaluator";
import { GroundTruth, Prediction } from "./types";

const truth: GroundTruth = {
    isAttack: true,
    classification: "brute_force",
    severity: "high",
};

// Simulate a "correct" AI prediction
const goodPrediction: Prediction = {
    isAttack: true,
    classification: "brute_force",
    severity: "high",
};

// Simulate a "wrong" AI prediction
const badPrediction: Prediction = {
    isAttack: true,
    classification: "phishing",
    severity: "low",
};

console.log("Good prediction result:", evaluate("SCN-001", truth, goodPrediction));
console.log("Bad prediction result:", evaluate("SCN-001", truth, badPrediction));