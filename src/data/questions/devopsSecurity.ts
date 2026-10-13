import { Question } from '../../types/interview';

export const DEVOPS_SECURITY_QUESTIONS: Question[] = [
  // ==================== DEVOPS & SRE TRACK ====================
  {
    id: 'cidr-ip-validator',
    title: '1. CIDR Subnet Matcher & IPv4 Validator',
    difficulty: 'Medium',
    category: 'DevOps, Cloud & SRE',
    trackId: 'devops_cloud',
    timeEstimateMinutes: 20,
    description: `Implement the IP routing lookup logic used in Cloud VPC Security Groups and Firewalls.

Given an IPv4 address string \`ip\` and a CIDR block string \`cidr\` (e.g. \`"192.168.1.50"\` and \`"192.168.1.0/24"\`):
1. Parse the IPv4 address into a 32-bit unsigned integer:
   \`(octet0 << 24) | (octet1 << 16) | (octet2 << 8) | octet3\`
2. Split \`cidr\` into base IP and prefix length \`prefixLen\` (0 to 32).
3. Compute the subnet mask: \`prefixLen === 0 ? 0 : (~0 << (32 - prefixLen)) >>> 0\`.
4. Return \`true\` if \`(ipInt & mask) === (baseIpInt & mask)\`, otherwise \`false\`.`,
    examples: [
      {
        input: 'ip = "192.168.1.50", cidr = "192.168.1.0/24"',
        output: 'true',
      },
      {
        input: 'ip = "10.0.0.1", cidr = "192.168.0.0/16"',
        output: 'false',
      },
    ],
    constraints: [
      'ip and cidr base are valid IPv4 strings',
      '0 <= prefixLen <= 32',
    ],
    functionName: 'isIpInSubnet',
    starterCode: {
      javascript: `/**
 * @param {string} ip
 * @param {string} cidr
 * @return {boolean}
 */
function isIpInSubnet(ip, cidr) {
  function ipToInt(ipStr) {
    return ipStr
      .split('.')
      .map(Number)
      .reduce((acc, octet) => ((acc << 8) + octet) >>> 0, 0);
  }

  const [baseIpStr, prefixLenStr] = cidr.split('/');
  const prefixLen = Number(prefixLenStr);

  const ipInt = ipToInt(ip);
  const baseInt = ipToInt(baseIpStr);
  const mask = prefixLen === 0 ? 0 : ((0xffffffff << (32 - prefixLen)) >>> 0);

  return (ipInt & mask) === (baseInt & mask);
}
`,
      typescript: `function isIpInSubnet(ip: string, cidr: string): boolean {
  function ipToInt(ipStr: string): number {
    return ipStr
      .split('.')
      .map(Number)
      .reduce((acc, octet) => ((acc << 8) + octet) >>> 0, 0);
  }

  const [baseIpStr, prefixLenStr] = cidr.split('/');
  const prefixLen = Number(prefixLenStr);

  const ipInt = ipToInt(ip);
  const baseInt = ipToInt(baseIpStr);
  const mask = prefixLen === 0 ? 0 : ((0xffffffff << (32 - prefixLen)) >>> 0);

  return (ipInt & mask) === (baseInt & mask);
}
`,
      python: `def isIpInSubnet(ip: str, cidr: str) -> bool:
    def ip_to_int(s: str) -> int:
        res = 0
        for octet in s.split('.'):
            res = (res << 8) + int(octet)
        return res

    base_ip, prefix_len_str = cidr.split('/')
    prefix_len = int(prefix_len_str)
    
    ip_int = ip_to_int(ip)
    base_int = ip_to_int(base_ip)
    mask = 0 if prefix_len == 0 else ((0xFFFFFFFF << (32 - prefix_len)) & 0xFFFFFFFF)

    return (ip_int & mask) == (base_int & mask)
`,
      cpp: `#include <string>
// C++ stub
`,
      java: `class Solution {
// Java stub
}
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'cidr-1',
        input: 'ip = "192.168.1.50", cidr = "192.168.1.0/24"',
        expectedOutput: 'true',
        rawInput: ['192.168.1.50', '192.168.1.0/24'],
        rawExpected: true,
      },
      {
        id: 'cidr-2',
        input: 'ip = "10.0.0.1", cidr = "192.168.0.0/16"',
        expectedOutput: 'false',
        rawInput: ['10.0.0.1', '192.168.0.0/16'],
        rawExpected: false,
      },
    ],
  },
  {
    id: 'jwt-auth-parser',
    title: '2. JWT Token Parser & Claim Validator',
    difficulty: 'Easy',
    category: 'DevOps, Cloud & SRE',
    trackId: 'devops_cloud',
    timeEstimateMinutes: 15,
    description: `Implement the JSON Web Token (JWT) inspection engine used in API gateways.

Given a 3-part JWT string \`jwtToken\` (\`"header.payload.signature"\`) and \`currentTimestamp\`:
1. Verify token has exactly 3 dot-separated parts.
2. Base64URL decode the payload (replacing \`-\` with \`+\` and \`_\` with \`/\` before decoding).
3. Parse the JSON payload.
4. Check if \`payload.exp\` exists and \`payload.exp < currentTimestamp\` -> return \`{ valid: false, error: "Token expired" }\`.
5. Check if \`payload.sub\` is present -> return \`{ valid: true, payload: decodedPayload }\`, else \`{ valid: false, error: "Missing subject claim" }\`.`,
    examples: [
      {
        input: 'jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiQWxpY2UiLCJleHAiOjIwMDAwMDAwMDB9.signature", currentTimestamp = 1600000000',
        output: '{"valid": true, "payload": {"sub": "123456", "name": "Alice", "exp": 2000000000}}',
      },
    ],
    constraints: [
      'Token is UTF-8 encoded',
    ],
    functionName: 'parseAndValidateJwt',
    starterCode: {
      javascript: `/**
 * @param {string} jwtToken
 * @param {number} currentTimestamp
 * @return {Object}
 */
function parseAndValidateJwt(jwtToken, currentTimestamp) {
  const parts = jwtToken.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token structure' };
  }

  let payload;
  try {
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) base64 += '=';
    const jsonStr = atob(base64);
    payload = JSON.parse(jsonStr);
  } catch (err) {
    return { valid: false, error: 'Malformed payload' };
  }

  if (payload.exp && payload.exp < currentTimestamp) {
    return { valid: false, error: 'Token expired' };
  }

  if (!payload.sub) {
    return { valid: false, error: 'Missing subject claim' };
  }

  return { valid: true, payload };
}
`,
      typescript: `function parseAndValidateJwt(
  jwtToken: string,
  currentTimestamp: number
): { valid: boolean; payload?: any; error?: string } {
  const parts = jwtToken.split('.');
  if (parts.length !== 3) return { valid: false, error: 'Invalid token structure' };

  let payload: any;
  try {
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) base64 += '=';
    const jsonStr = atob(base64);
    payload = JSON.parse(jsonStr);
  } catch (err) {
    return { valid: false, error: 'Malformed payload' };
  }

  if (payload.exp && payload.exp < currentTimestamp) {
    return { valid: false, error: 'Token expired' };
  }

  if (!payload.sub) {
    return { valid: false, error: 'Missing subject claim' };
  }

  return { valid: true, payload };
}
`,
      python: `import json, base64

def parseAndValidateJwt(jwtToken: str, currentTimestamp: int) -> dict:
    parts = jwtToken.split('.')
    if len(parts) != 3:
        return {"valid": False, "error": "Invalid token structure"}

    try:
        b64 = parts[1].replace('-', '+').replace('_', '/')
        b64 += '=' * ((4 - len(b64) % 4) % 4)
        payload = json.loads(base64.b64decode(b64).decode('utf-8'))
    except Exception:
        return {"valid": False, "error": "Malformed payload"}

    if 'exp' in payload and payload['exp'] < currentTimestamp:
        return {"valid": False, "error": "Token expired"}

    if 'sub' not in payload:
        return {"valid": False, "error": "Missing subject claim"}

    return {"valid": True, "payload": payload}
`,
      cpp: `#include <string>
// C++ stub
`,
      java: `import java.util.*;
// Java stub
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'jwt-1',
        input: 'jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiQWxpY2UiLCJleHAiOjIwMDAwMDAwMDB9.signature", currentTimestamp = 1600000000',
        expectedOutput: '{"valid": true, "payload": {"sub": "123456", "name": "Alice", "exp": 2000000000}}',
        rawInput: [
          'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiQWxpY2UiLCJleHAiOjIwMDAwMDAwMDB9.signature',
          1600000000,
        ],
        rawExpected: {
          valid: true,
          payload: { sub: '123456', name: 'Alice', exp: 2000000000 },
        },
      },
    ],
  },
  {
    id: 'cron-next-timestamp',
    title: '3. Cron Schedule Trigger Calculator',
    difficulty: 'Medium',
    category: 'DevOps, Cloud & SRE',
    trackId: 'devops_cloud',
    timeEstimateMinutes: 20,
    description: `Implement the cron scheduler calculation engine used in workflow engines (Kubernetes CronJobs, Celery).

Given a simplified cron interval pattern \`"*/M"\` where \`M\` is minute interval (1 to 59) and \`currentEpochSeconds\`:
1. Calculate the next minute timestamp (epoch seconds divisible by 60) that is strictly \`> currentEpochSeconds\` and where \`minute % M === 0\`.
2. Return the next trigger epoch seconds.`,
    examples: [
      {
        input: 'intervalMinutes = 15, currentEpochSeconds = 1600000000',
        output: '1600000800',
      },
    ],
    constraints: [
      '1 <= intervalMinutes <= 59',
      'currentEpochSeconds >= 0',
    ],
    functionName: 'getNextCronTrigger',
    starterCode: {
      javascript: `/**
 * @param {number} intervalMinutes
 * @param {number} currentEpochSeconds
 * @return {number}
 */
function getNextCronTrigger(intervalMinutes, currentEpochSeconds) {
  let nextSec = (Math.floor(currentEpochSeconds / 60) + 1) * 60;
  while (true) {
    const d = new Date(nextSec * 1000);
    const min = d.getUTCMinutes();
    if (min % intervalMinutes === 0) {
      return nextSec;
    }
    nextSec += 60;
  }
}
`,
      typescript: `function getNextCronTrigger(intervalMinutes: number, currentEpochSeconds: number): number {
  let nextSec = (Math.floor(currentEpochSeconds / 60) + 1) * 60;
  while (true) {
    const d = new Date(nextSec * 1000);
    const min = d.getUTCMinutes();
    if (min % intervalMinutes === 0) {
      return nextSec;
    }
    nextSec += 60;
  }
}
`,
      python: `import datetime

def getNextCronTrigger(intervalMinutes: int, currentEpochSeconds: int) -> int:
    next_sec = (currentEpochSeconds // 60 + 1) * 60
    while True:
        d = datetime.datetime.fromtimestamp(next_sec, tz=datetime.timezone.utc)
        if d.minute % intervalMinutes == 0:
            return next_sec
        next_sec += 60
`,
      cpp: `#include <ctime>
// C++ stub
`,
      java: `class Solution {
// Java stub
}
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'cron-1',
        input: 'intervalMinutes = 15, currentEpochSeconds = 1600000000',
        expectedOutput: '1600000800',
        rawInput: [15, 1600000000],
        rawExpected: 1600000800,
      },
    ],
  },
  {
    id: 'log-metrics-aggregator',
    title: '4. Server Log Telemetry Aggregator',
    difficulty: 'Medium',
    category: 'DevOps, Cloud & SRE',
    trackId: 'devops_cloud',
    timeEstimateMinutes: 20,
    description: `Implement telemetry stream aggregation used in observability platforms (Datadog, Prometheus).

Given an array of log lines formatted as:
\`"[TIMESTAMP] METHOD /endpoint STATUS_CODE LATENCY_MS"\`
e.g. \`"[2026-08-20T10:00:00Z] GET /api/v1/users 200 45"\`

Compute and return an object:
- \`totalRequests\`: number of log lines
- \`errorRatePercent\`: percentage of responses with \`STATUS_CODE >= 400\` (rounded to 1 decimal place)
- \`p95LatencyMs\`: 95th percentile latency (sorted ascending, index \`Math.floor(0.95 * totalRequests)\`)
- \`topEndpoint\`: the most frequently requested endpoint`,
    examples: [
      {
        input: 'logs = ["[t1] GET /users 200 30", "[t2] POST /users 500 120", "[t3] GET /users 200 45"]',
        output: '{"totalRequests": 3, "errorRatePercent": 33.3, "p95LatencyMs": 120, "topEndpoint": "/users"}',
      },
    ],
    constraints: [
      '1 <= logs.length <= 1000',
    ],
    functionName: 'aggregateServerLogs',
    starterCode: {
      javascript: `/**
 * @param {string[]} logLines
 * @return {{totalRequests: number, errorRatePercent: number, p95LatencyMs: number, topEndpoint: string}}
 */
function aggregateServerLogs(logLines) {
  const totalRequests = logLines.length;
  let errorCount = 0;
  const latencies = [];
  const endpointCounts = new Map();

  for (const line of logLines) {
    const parts = line.split(' ');
    // [TIMESTAMP] METHOD /endpoint STATUS LATENCY
    const endpoint = parts[2];
    const status = parseInt(parts[3], 10);
    const latency = parseInt(parts[4], 10);

    if (status >= 400) errorCount++;
    latencies.push(latency);
    endpointCounts.set(endpoint, (endpointCounts.get(endpoint) || 0) + 1);
  }

  latencies.sort((a, b) => a - b);
  const p95Idx = Math.min(latencies.length - 1, Math.floor(0.95 * totalRequests));
  const p95LatencyMs = latencies[p95Idx];

  let topEndpoint = '';
  let maxCount = -1;
  for (const [ep, count] of endpointCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      topEndpoint = ep;
    }
  }

  return {
    totalRequests,
    errorRatePercent: Math.round((errorCount / totalRequests) * 1000) / 10,
    p95LatencyMs,
    topEndpoint,
  };
}
`,
      typescript: `function aggregateServerLogs(
  logLines: string[]
): { totalRequests: number; errorRatePercent: number; p95LatencyMs: number; topEndpoint: string } {
  const totalRequests = logLines.length;
  let errorCount = 0;
  const latencies: number[] = [];
  const endpointCounts = new Map<string, number>();

  for (const line of logLines) {
    const parts = line.split(' ');
    const endpoint = parts[2];
    const status = parseInt(parts[3], 10);
    const latency = parseInt(parts[4], 10);

    if (status >= 400) errorCount++;
    latencies.push(latency);
    endpointCounts.set(endpoint, (endpointCounts.get(endpoint) || 0) + 1);
  }

  latencies.sort((a, b) => a - b);
  const p95Idx = Math.min(latencies.length - 1, Math.floor(0.95 * totalRequests));
  const p95LatencyMs = latencies[p95Idx];

  let topEndpoint = '';
  let maxCount = -1;
  for (const [ep, count] of endpointCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      topEndpoint = ep;
    }
  }

  return {
    totalRequests,
    errorRatePercent: Math.round((errorCount / totalRequests) * 1000) / 10,
    p95LatencyMs,
    topEndpoint,
  };
}
`,
      python: `def aggregateServerLogs(logLines: list[str]) -> dict:
    total = len(logLines)
    error_cnt = 0
    latencies = []
    ep_counts = {}

    for line in logLines:
        parts = line.split()
        ep = parts[2]
        status = int(parts[3])
        lat = int(parts[4])

        if status >= 400:
            error_cnt += 1
        latencies.append(lat)
        ep_counts[ep] = ep_counts.get(ep, 0) + 1

    latencies.sort()
    p95_idx = min(len(latencies) - 1, int(0.95 * total))
    p95 = latencies[p95_idx]

    top_ep = max(ep_counts.keys(), key=lambda k: ep_counts[k])

    return {
        "totalRequests": total,
        "errorRatePercent": round((error_cnt / total) * 100, 1),
        "p95LatencyMs": p95,
        "topEndpoint": top_ep
    }
`,
      cpp: `#include <vector>
// C++ stub
`,
      java: `import java.util.*;
// Java stub
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'log-1',
        input: 'logs = ["[t1] GET /users 200 30", "[t2] POST /users 500 120", "[t3] GET /users 200 45"]',
        expectedOutput: '{"totalRequests": 3, "errorRatePercent": 33.3, "p95LatencyMs": 120, "topEndpoint": "/users"}',
        rawInput: [
          [
            '[t1] GET /users 200 30',
            '[t2] POST /users 500 120',
            '[t3] GET /users 200 45',
          ],
        ],
        rawExpected: {
          totalRequests: 3,
          errorRatePercent: 33.3,
          p95LatencyMs: 120,
          topEndpoint: '/users',
        },
      },
    ],
  },

  // ==================== CYBERSECURITY TRACK ====================
  {
    id: 'merkle-tree-root',
    title: '1. Merkle Tree Root Hash Generator',
    difficulty: 'Medium',
    category: 'Cybersecurity & Cryptography',
    trackId: 'cybersecurity',
    timeEstimateMinutes: 20,
    description: `Implement the Merkle Tree root calculation used in blockchain data integrity and git commit trees.

Given an array of leaf transaction strings \`transactions\`:
1. Use simple deterministic hash:
   \`hash(s) = "H(" + s + ")"\`
2. At each level, if the number of nodes is odd, duplicate the last node.
3. Pair adjacent nodes \`[A, B]\` into parent \`"H(" + A + "+" + B + ")"\`.
4. Repeat until a single root hash remains. If \`transactions\` is empty, return \`""\`.`,
    examples: [
      {
        input: 'transactions = ["tx1", "tx2"]',
        output: '"H(H(tx1)+H(tx2))"',
      },
    ],
    constraints: [
      '0 <= transactions.length <= 64',
    ],
    functionName: 'calculateMerkleRoot',
    starterCode: {
      javascript: `/**
 * @param {string[]} transactions
 * @return {string}
 */
function calculateMerkleRoot(transactions) {
  if (!transactions || transactions.length === 0) return '';
  let currentLevel = transactions.map((tx) => \`H(\${tx})\`);

  while (currentLevel.length > 1) {
    if (currentLevel.length % 2 !== 0) {
      currentLevel.push(currentLevel[currentLevel.length - 1]);
    }
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      nextLevel.push(\`H(\${currentLevel[i]}+\${currentLevel[i + 1]})\`);
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}
`,
      typescript: `function calculateMerkleRoot(transactions: string[]): string {
  if (!transactions || transactions.length === 0) return '';
  let currentLevel = transactions.map((tx) => \`H(\${tx})\`);

  while (currentLevel.length > 1) {
    if (currentLevel.length % 2 !== 0) {
      currentLevel.push(currentLevel[currentLevel.length - 1]);
    }
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      nextLevel.push(\`H(\${currentLevel[i]}+\${currentLevel[i + 1]})\`);
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}
`,
      python: `def calculateMerkleRoot(transactions: list[str]) -> str:
    if not transactions:
        return ""
    current = [f"H({tx})" for tx in transactions]
    while len(current) > 1:
        if len(current) % 2 != 0:
            current.append(current[-1])
        next_lvl = []
        for i in range(0, len(current), 2):
            next_lvl.append(f"H({current[i]}+{current[i+1]})")
        current = next_lvl
    return current[0]
`,
      cpp: `#include <vector>
#include <string>
// C++ stub
`,
      java: `import java.util.*;
// Java stub
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'mt-1',
        input: 'transactions = ["tx1", "tx2"]',
        expectedOutput: '"H(H(tx1)+H(tx2))"',
        rawInput: [['tx1', 'tx2']],
        rawExpected: 'H(H(tx1)+H(tx2))',
      },
    ],
  },
  {
    id: 'password-entropy-evaluator',
    title: '2. Password Security & Shannon Entropy Evaluator',
    difficulty: 'Easy',
    category: 'Cybersecurity & Cryptography',
    trackId: 'cybersecurity',
    timeEstimateMinutes: 15,
    description: `Implement the NIST SP 800-63B password entropy and strength evaluator.

Given a string \`password\`:
1. Identify pool size $R$:
   - Has lowercase \`[a-z]\`: +26
   - Has uppercase \`[A-Z]\`: +26
   - Has digits \`[0-9]\`: +10
   - Has special symbols: +32
2. Compute Shannon Pool Entropy: $E = L \\times \\log_2(R)$ where $L$ is length.
3. Rating:
   - $E < 36$: \`"Weak"\`
   - $36 \\le E < 60$: \`"Medium"\`
   - $60 \\le E < 80$: \`"Strong"\`
   - $E \\ge 80$: \`"Very Strong"\`
4. Return \`{ entropyBits: Math.round(E), strength: rating }\`.`,
    examples: [
      {
        input: 'password = "Password123!"',
        output: '{"entropyBits": 79, "strength": "Strong"}',
      },
    ],
    constraints: [
      '1 <= password.length <= 100',
    ],
    functionName: 'evaluatePasswordEntropy',
    starterCode: {
      javascript: `/**
 * @param {string} password
 * @return {{entropyBits: number, strength: string}}
 */
function evaluatePasswordEntropy(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;

  const entropy = pool === 0 ? 0 : password.length * Math.log2(pool);
  const entropyBits = Math.round(entropy);

  let strength = 'Weak';
  if (entropyBits >= 80) strength = 'Very Strong';
  else if (entropyBits >= 60) strength = 'Strong';
  else if (entropyBits >= 36) strength = 'Medium';

  return { entropyBits, strength };
}
`,
      typescript: `function evaluatePasswordEntropy(
  password: string
): { entropyBits: number; strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' } {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;

  const entropy = pool === 0 ? 0 : password.length * Math.log2(pool);
  const entropyBits = Math.round(entropy);

  let strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Weak';
  if (entropyBits >= 80) strength = 'Very Strong';
  else if (entropyBits >= 60) strength = 'Strong';
  else if (entropyBits >= 36) strength = 'Medium';

  return { entropyBits, strength };
}
`,
      python: `import math, re

def evaluatePasswordEntropy(password: str) -> dict:
    pool = 0
    if re.search(r'[a-z]', password): pool += 26
    if re.search(r'[A-Z]', password): pool += 26
    if re.search(r'[0-9]', password): pool += 10
    if re.search(r'[^a-zA-Z0-9]', password): pool += 32

    entropy = len(password) * math.log2(pool) if pool > 0 else 0
    bits = round(entropy)

    strength = "Weak"
    if bits >= 80: strength = "Very Strong"
    elif bits >= 60: strength = "Strong"
    elif bits >= 36: strength = "Medium"

    return {"entropyBits": bits, "strength": strength}
`,
      cpp: `#include <string>
// C++ stub
`,
      java: `class Solution {
// Java stub
}
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'pwd-1',
        input: 'password = "Password123!"',
        expectedOutput: '{"entropyBits": 79, "strength": "Strong"}',
        rawInput: ['Password123!'],
        rawExpected: { entropyBits: 79, strength: 'Strong' },
      },
    ],
  },
  {
    id: 'caesar-vigenere-cipher',
    title: '3. Polyalphabetic Vigenère Cipher Stream',
    difficulty: 'Easy',
    category: 'Cybersecurity & Cryptography',
    trackId: 'cybersecurity',
    timeEstimateMinutes: 15,
    description: `Implement the classical polyalphabetic Vigenère Stream Cipher.

Given \`text\`, key \`key\` (uppercase/lowercase letters), and \`mode\` (\`"encode"\` | \`"decode"\`):
- For each alphabetic character in \`text\`, shift it by the corresponding key character's index (\`a/A = 0, ..., z/Z = 25\`).
- Non-alphabetic characters (spaces, punctuation) are preserved without advancing the key.
- Letter casing (uppercase vs lowercase) is preserved.`,
    examples: [
      {
        input: 'text = "ATTACK AT DAWN", key = "LEMON", mode = "encode"',
        output: '"LXFOPV EF RNHR"',
      },
    ],
    constraints: [
      'key contains only ASCII letters and is not empty',
    ],
    functionName: 'vigenereCipher',
    starterCode: {
      javascript: `/**
 * @param {string} text
 * @param {string} key
 * @param {string} mode - "encode" | "decode"
 * @return {string}
 */
function vigenereCipher(text, key, mode) {
  const isEncode = mode === 'encode';
  const cleanKey = key.toUpperCase();
  let keyIdx = 0;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;
      const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 65;
      const charCode = char.charCodeAt(0) - base;

      let newCode;
      if (isEncode) {
        newCode = (charCode + shift) % 26;
      } else {
        newCode = (charCode - shift + 26) % 26;
      }

      result += String.fromCharCode(base + newCode);
      keyIdx++;
    } else {
      result += char;
    }
  }

  return result;
}
`,
      typescript: `function vigenereCipher(text: string, key: string, mode: 'encode' | 'decode'): string {
  const isEncode = mode === 'encode';
  const cleanKey = key.toUpperCase();
  let keyIdx = 0;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;
      const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 65;
      const charCode = char.charCodeAt(0) - base;

      let newCode: number;
      if (isEncode) {
        newCode = (charCode + shift) % 26;
      } else {
        newCode = (charCode - shift + 26) % 26;
      }

      result += String.fromCharCode(base + newCode);
      keyIdx++;
    } else {
      result += char;
    }
  }

  return result;
}
`,
      python: `def vigenereCipher(text: str, key: str, mode: str) -> str:
    is_encode = mode == "encode"
    clean_key = key.upper()
    key_idx = 0
    res = []

    for c in text:
        if c.isalpha():
            is_upper = c.isupper()
            base = 65 if is_upper else 97
            shift = ord(clean_key[key_idx % len(clean_key)]) - 65
            code = ord(c) - base
            new_code = (code + shift) % 26 if is_encode else (code - shift + 26) % 26
            res.append(chr(base + new_code))
            key_idx += 1
        else:
            res.append(c)

    return "".join(res)
`,
      cpp: `#include <string>
// C++ stub
`,
      java: `class Solution {
// Java stub
}
`,
      go: `package main
// Go stub
`,
    },
    testCases: [
      {
        id: 'vig-1',
        input: 'text = "ATTACK AT DAWN", key = "LEMON", mode = "encode"',
        expectedOutput: '"LXFOPV EF RNHR"',
        rawInput: ['ATTACK AT DAWN', 'LEMON', 'encode'],
        rawExpected: 'LXFOPV EF RNHR',
      },
    ],
  },
];
