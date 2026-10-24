import type {
    SecurityScenario,
    Severity,
    AttackType
} from "../scenarios/scenarios.js";

export interface AIPrediction {
    isAttack: boolean;
    attackType: AttackType;
    severity: Severity;
    confidence: number;
}

export async function analyzeScenario(
    scenario: SecurityScenario
): Promise<AIPrediction> {

    const prompt = `
You are a cybersecurity analysis AI.

Analyze the following security scenario:

${scenario.events.map(event => `- ${event}`).join("\n")}

Return ONLY valid JSON.

The JSON must use exactly this format:

{
  "isAttack": true,
  "attackType": "brute_force",
  "severity": "high",
  "confidence": 0.90
}

Rules:

isAttack must be either true or false.

attackType must be exactly one of:
- brute_force
- phishing
- port_scan
- malware
- normal

severity must be exactly one of:
- low
- medium
- high
- critical

confidence must be a number between 0 and 1.

Use confidence to represent how certain you are about the complete classification.

Do not use ranges such as "medium to high".
Do not include explanations outside the JSON.
`;

    let response: Response;

    try {
        response = await fetch(
            "http://127.0.0.1:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:latest",
                    prompt,
                    stream: false,
                    format: "json"
                })
            }
        );
    } catch {
        throw new Error(
            "Could not connect to Ollama at http://127.0.0.1:11434. " +
            "Make sure Ollama is running before starting CyberEval."
        );
    }

    if (!response.ok) {
        throw new Error(
            `Ollama request failed: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (!data.response) {
        throw new Error(
            "Ollama returned an empty response."
        );
    }

    let prediction: AIPrediction;

    try {
        prediction = JSON.parse(data.response);
    } catch {
        throw new Error(
            `Ollama returned invalid JSON: ${data.response}`
        );
    }

    const validAttackTypes: AttackType[] = [
        "brute_force",
        "phishing",
        "port_scan",
        "malware",
        "normal"
    ];

    const validSeverities: Severity[] = [
        "low",
        "medium",
        "high",
        "critical"
    ];

    if (typeof prediction.isAttack !== "boolean") {
        throw new Error(
            "Invalid AI response: isAttack must be true or false."
        );
    }

    if (!validAttackTypes.includes(prediction.attackType)) {
        throw new Error(
            `Invalid AI response: unknown attack type "${prediction.attackType}".`
        );
    }

    if (!validSeverities.includes(prediction.severity)) {
        throw new Error(
            `Invalid AI response: unknown severity "${prediction.severity}".`
        );
    }

    if (
        typeof prediction.confidence !== "number" ||
        prediction.confidence < 0 ||
        prediction.confidence > 1
    ) {
        throw new Error(
            "Invalid AI response: confidence must be a number between 0 and 1."
        );
    }

    return prediction;
}