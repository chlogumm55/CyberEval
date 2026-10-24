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

    Use your confidence to represent how certain you are about the
    complete classification.

    Do not use ranges such as "medium to high".
    Do not include explanations outside the JSON.
    `;

    const response = await fetch(
        "http://localhost:11434/api/generate",
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

    if (!response.ok) {
        throw new Error(
            `Ollama request failed: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    const prediction: AIPrediction = JSON.parse(data.response);

    return prediction;
}