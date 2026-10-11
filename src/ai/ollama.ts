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