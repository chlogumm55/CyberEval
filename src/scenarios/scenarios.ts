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
    },

    {
        id: "SCN-004",
        events: [
            "A single external IP address contacted 200 different ports",
            "Most connections attempts were unsuccessful",
            "The activity occurred within a five-minute period"
        ],
        groundTruth: {
            isAttack: true,
            attackType: "port_scan",
            severity: "medium"
        }
    },

    {
        id: "SCN-005",
        events: [
            "An unknown executable appeared on a workstation",
            "The executable started without user interaction",
            "The process attempted to connect to an unfamiliar external server"
        ],
        groundTruth: {
            isAttack: true,
            attackType: "malware",
            severity: "high"
        }
    },

    {
        id: "SCN-006",
        events: [
            "A user received an email from an unfamiliar sender",
            "The email contained an attachment",
            "The attachment was blocked by the organization's email security system"
        ],
        groundTruth: {
            isAttack: true,
            attackType: "phishing",
            severity: "medium"
        }
    },

    {
        id: "SCN-007",
        events: [
            "A server received several connection attempts from different IP addresses",
            "The connections targeted a public web service",
            "No successful authentication attempts occurred"
        ],
        groundTruth: {
            isAttack: true,
            attackType: "port_scan",
            severity: "medium"
        }
    },

    {
        id: "SCN-008",
        events: [
            "A user logged in from their usual workstation",
            "The login occurred during normal business hours",
            "The user accessed files they normally work with",
            "No unusual processes or network connections were detected"
        ],
        groundTruth: {
            isAttack: false,
            attackType: "normal",
            severity: "low"
        }
    }
];