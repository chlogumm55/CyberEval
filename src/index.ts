import { scenarios } from "./scenarios/scenarios.js";
import { evaluatePrediction } from "./evaluation/evaluator.js";
import { analyzeScenario } from "./ai/ollama.js";

console.log("CyberEval Evaluation Test");
console.log("=========================");

let totalScore = 0;
let attackCorrectCount = 0;
let attackTypeCorrectCount = 0;
let severityCorrectCount = 0;

for (const scenario of scenarios) {
    console.log("");
    console.log("Analyzing:", scenario.id);

    try {
        const prediction = await analyzeScenario(scenario);

        const result = evaluatePrediction(scenario, prediction);

        console.log("AI Prediction:");
        console.log("   Is Attack:", prediction.isAttack);
        console.log("   Attack Type:", prediction.attackType);
        console.log("   Severity:", prediction.severity);

        console.log("");
        console.log("Evaluation:");
        console.log("   Attack Correct:", result.attackCorrect);
        console.log("   Attack Type Correct:", result.attackTypeCorrect);
        console.log("   Severity Correct:", result.severityCorrect);
        console.log("   Score:", `${result.score * 100}%`);

        totalScore += result.score;

        if (result.attackCorrect) {
            attackCorrectCount++;
        }

        if (result.attackTypeCorrect) {
            attackTypeCorrectCount++;
        }

        if (result.severityCorrect) {
            severityCorrectCount++;
        }

    } catch (error) {
        console.error("Error analyzing scenario:", error);
    }
}

const scenarioCount = scenarios.length;

const overallScore = totalScore / scenarioCount;
const attackAccuracy = attackCorrectCount / scenarioCount;
const attackTypeAccuracy = attackTypeCorrectCount / scenarioCount;
const severityAccuracy = severityCorrectCount / scenarioCount;

console.log("");
console.log("=========================");
console.log("CyberEval Overall Results");
console.log("=========================");

console.log(
    "Overall Score:",
    `${(overallScore * 100).toFixed(2)}%`
);

console.log(
    "Attack Detection Accuracy:",
    `${(attackAccuracy * 100).toFixed(2)}%`
);

console.log(
    "Attack Type Accuracy:",
    `${(attackTypeAccuracy * 100).toFixed(2)}%`
);

console.log(
    "Severity Accuracy:",
    `${(severityAccuracy * 100).toFixed(2)}%`
);