import type {
    SecurityScenario,
    Severity,
    AttackType
} from "../scenarios/scenarios.js";

export interface AIPrediction {
    isAttack: boolean;
    attackType: AttackType;
    severity: Severity;
}

export interface EvaluationResult {
    scenarioId: string;
    attackCorrect: boolean;
    attackTypeCorrect: boolean;
    severityCorrect: boolean;
    score: number;
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

    return {
        scenarioId: scenario.id,
        attackCorrect,
        attackTypeCorrect,
        severityCorrect,
        score
    };
}