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

export async function analyzeScenario(
    scenario: SecurityScenario
): Promise<AIPrediction> {

    const prompt = `
    You are a cybersecurity analysis AI.

    Analyze the following security scenario:

    ${scenario.events.map(event => `- ${event}`).join("\n")}

    Classify the scenario and return ONLY valid JSON.

    The JSON must use exactly this format:

    {
      "isAttack": true,
      "attackType": "brute_force",
      "severity": "high"
    }

    Allowed attackType values:
    - brute_force
    - phishing
    - port_scan
    - malware
    - normal

    Allowed severity values:
    - low
    - medium
    - high
    - critical

    Do not include any explanation outside the JSON.
    `;

    const response = await fetch("http://localhost:11434/api/generate", {
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
    });

    if (!response.ok) {
        throw new Error(
            `Ollama request failed: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    const prediction: AIPrediction = JSON.parse(data.response);

    return prediction;
}