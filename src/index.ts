import { scenarios } from "./scenarios/scenarios.js";
import { evaluatePrediction } from "./evaluation/evaluator.js";
import { analyzeScenario } from "./ai/ollama.js";

console.log("CyberEval Evaluation Test");
console.log("=========================");

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

    } catch (error) {
        console.error("Error analyzing scenario:", error);
    }
}