export type Severity = "low" | "medium" | "high" | "critical";

export type AttackType = 
    | "brute_force"
    | "phishing"
    | "port_scan"
    | "malware"
    | "normal";

export interface SecurityScenario {
    id: string;
    events: string[];
    groundTruth: {
        isAttack: boolean;
        attackType: AttackType;
        severity: Severity;
    };
}

export const scenarios: SecurityScenario[] = [
    {
        id: "SCN-001",
        events: [
            "15 failed login attempts from the same IP address",
            "A successful login occurred from the same IP",
            "A new process started immediately after the login"
        ],
        groundTruth: {
            isAttack: true,
            attackType: "brute_force",
            severity: "high"
        }
    },

    {
        id: "SCN-002",
        events: [
            "A user received an email containing a suspicious link",
            "The link redirects to an unknown website",
            "The email asks the user to enter their password"
        ],
        groundTruth: {
            isAttack: true,
            attackType: "phishing",
            severity: "high"
        }
    },

    {
        id: "SCN-003",
        events: [
            "A workstation completed its scheduled software update",
            "The user logged in during normal business hours",
            "No unusual network activity was detected"
        ],
        groundTruth: {
            isAttack: false,
            attackType: "normal",
            severity: "low"
        }
    }
];