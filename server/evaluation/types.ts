export type Severity = "low" | "medium" | "high" | "critical";

export interface GroundTruth {
    isAttack: boolean;
    classification: string;
    severity: Severity;
}

export interface Prediction {
    isAttack: boolean;
    classification: string;
    severity: Severity;
}

export interface Scenario {
    id: string;
    attackType: string;
    severity: Severity;
    events: string[];
    groundTruth: GroundTruth;
}

export interface EvalResult {
    scenarioId: string;
    classificationCorrect: boolean;
    severityCorrect: boolean;
    isAttackCorrect: boolean;
}