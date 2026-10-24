import type {
    SecurityScenario
} from "../scenarios/scenarios.js";

import type {
    AIPrediction
} from "../ai/ollama.js";

export interface EvaluationResult {
    scenarioId: string;
    attackCorrect: boolean;
    attackTypeCorrect: boolean;
    severityCorrect: boolean;
    score: number;
    confidence: number;
    uncertainty: "low" | "medium" | "high";
}

export function evaluatePrediction(
    scenario: SecurityScenario,
    prediction: AIPrediction
): EvaluationResult {

    const attackCorrect =
        scenario.groundTruth.isAttack === prediction.isAttack;

    const attackTypeCorrect =
        scenario.groundTruth.attackType === prediction.attackType;

    const severityCorrect =
        scenario.groundTruth.severity === prediction.severity;

    const correctAnswers = [
        attackCorrect,
        attackTypeCorrect,
        severityCorrect
    ].filter(Boolean).length;

    const score = correctAnswers / 3;

    let uncertainty: "low" | "medium" | "high";

    if (prediction.confidence >= 0.80) {
        uncertainty = "low";
    } else if (prediction.confidence >= 0.50) {
        uncertainty = "medium";
    } else {
        uncertainty = "high";
    }

    return {
        scenarioId: scenario.id,
        attackCorrect,
        attackTypeCorrect,
        severityCorrect,
        score,
        confidence: prediction.confidence,
        uncertainty
    };
}