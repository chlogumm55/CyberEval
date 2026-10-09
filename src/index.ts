import { scenarios } from "./scenarios/scenarios.js";
import { evaluatePrediction } from "./evaluation/evaluator.js";

console.log("CyberEval Evaluation Test");
console.log("=========================");

for (const scenario of scenarios) {
    let prediction;

    if (scenario.id === "SCN-001") {
        prediction = {
            isAttack: true,
            attackType: "brute_force" as const,
            severity: "high" as const
        };
    } else if (scenario.id === "SCN-002") {
        prediction = {
            isAttack: true,
            attackType: "phishing" as const,
            severity: "high" as const
        };
    } else {
        prediction = {
            isAttack: false,
            attackType: "normal" as const,
            severity: "low" as const
        };
    }

    const result = evaluatePrediction(scenario, prediction);

    console.log("");
    console.log("Scenario:", result.scenarioId);
    console.log("Attack Correct:", result.attackCorrect);
    console.log("Attack Type Correct:", result.attackCorrect);
    console.log("Severity Correct:", result.severityCorrect);
    console.log("Score:", `${result.score * 100}%`);
}