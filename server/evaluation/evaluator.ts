import { GroundTruth, Prediction, EvalResult } from "./types";

export function evaluate(
    scenarioId: string,
    truth: GroundTruth,
    prediction: Prediction
): EvalResult {
    return {
        scenarioId,
        classificationCorrect: truth.classification === prediction.classification,
        severityCorrect: truth.severity === prediction.severity,
        isAttackCorrect: truth.isAttack === prediction.isAttack,
    };
}