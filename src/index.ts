import { scenarios } from "./scenarios/scenarios.js";
import { evaluatePrediction } from "./evaluation/evaluator.js";
import { analyzeScenario } from "./ai/ollama.js";

console.log("CyberEval AI Evaluation");
console.log("========================");

let totalScore = 0;
let attackCorrectCount = 0;
let attackTypeCorrectCount = 0;
let severityCorrectCount = 0;

const errors: {
    scenarioId: string;
    attackTypeCorrect: boolean;
    severityCorrect: boolean;
    expectedAttackType: string;
    predictedAttackType: string;
    expectedSeverity: string;
    predictedSeverity: string;
}[] = [];

const uncertainScenarios: {
    scenarioId: string;
    confidence: number;
    uncertainty: string;
}[] = [];

for (const scenario of scenarios) {
    console.log("");
    console.log("Analyzing:", scenario.id);

    try {
        const prediction = await analyzeScenario(scenario);

        const result = evaluatePrediction(
            scenario,
            prediction
        );

        console.log("AI Prediction:");
        console.log("   Is Attack:", prediction.isAttack);
        console.log("   Attack Type:", prediction.attackType);
        console.log("   Severity:", prediction.severity);
        console.log(
            "   Confidence:",
            `${(prediction.confidence * 100).toFixed(1)}%`
        );
        console.log(
            "   Uncertainty:",
            result.uncertainty
        );

        console.log("");
        console.log("Evaluation:");
        console.log(
            "   Attack Correct:",
            result.attackCorrect
        );
        console.log(
            "   Attack Type Correct:",
            result.attackTypeCorrect
        );
        console.log(
            "   Severity Correct:",
            result.severityCorrect
        );
        console.log(
            "   Score:",
            `${(result.score * 100).toFixed(2)}%`
        );

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

        if (
            !result.attackTypeCorrect ||
            !result.severityCorrect ||
            !result.attackCorrect
        ) {
            errors.push({
                scenarioId: scenario.id,
                attackTypeCorrect: result.attackTypeCorrect,
                severityCorrect: result.severityCorrect,
                expectedAttackType:
                    scenario.groundTruth.attackType,
                predictedAttackType:
                    prediction.attackType,
                expectedSeverity:
                    scenario.groundTruth.severity,
                predictedSeverity:
                    prediction.severity
            });
        }

        if (result.uncertainty !== "low") {
            uncertainScenarios.push({
                scenarioId: scenario.id,
                confidence: prediction.confidence,
                uncertainty: result.uncertainty
            });
        }

    } catch (error) {
        console.error(
            "Error analyzing scenario:",
            error
        );
    }
}

const scenarioCount = scenarios.length;

const overallScore =
    totalScore / scenarioCount;

const attackAccuracy =
    attackCorrectCount / scenarioCount;

const attackTypeAccuracy =
    attackTypeCorrectCount / scenarioCount;

const severityAccuracy =
    severityCorrectCount / scenarioCount;

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

console.log("");
console.log("=========================");
console.log("Prediction Errors");
console.log("=========================");

if (errors.length === 0) {
    console.log(
        "No prediction errors detected."
    );
} else {
    for (const error of errors) {
        console.log("");
        console.log(
            "Scenario:",
            error.scenarioId
        );

        if (!error.attackTypeCorrect) {
            console.log(
                "Attack Type:",
                `Expected ${error.expectedAttackType},`,
                `Predicted ${error.predictedAttackType}`
            );
        }

        if (!error.severityCorrect) {
            console.log(
                "Severity:",
                `Expected ${error.expectedSeverity},`,
                `Predicted ${error.predictedSeverity}`
            );
        }
    }
}

console.log("");
console.log(
    "Total Errors:",
    errors.length
);

console.log("");
console.log("=========================");
console.log("Uncertain Predictions");
console.log("=========================");

if (uncertainScenarios.length === 0) {
    console.log(
        "No uncertain predictions detected."
    );
} else {
    for (const uncertain of uncertainScenarios) {
        console.log("");
        console.log(
            "Scenario:",
            uncertain.scenarioId
        );
        console.log(
            "Confidence:",
            `${(uncertain.confidence * 100).toFixed(1)}%`
        );
        console.log(
            "Uncertainty:",
            uncertain.uncertainty
        );
    }
}

console.log("");
console.log(
    "Total Uncertain:",
    uncertainScenarios.length
);