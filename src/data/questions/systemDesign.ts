import { Question } from '../../types/interview';

export const SYSTEM_DESIGN_QUESTIONS: Question[] = [
  {
    id: 'consistent-hashing',
    title: '1. Consistent Hashing with Virtual Nodes',
    difficulty: 'Medium',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 20,
    description: `Implement a consistent hashing ring with virtual nodes for distributed cache key placement.

Given an array of server names \`servers\`, number of virtual nodes per server \`vnodes\`, and a target cache \`key\`, return the server that is assigned the key.

### Hashing Algorithm:
1. Virtual node identifier: \`"\${server}#\${vnodeIndex}"\` for \`vnodeIndex\` from \`0\` to \`vnodes - 1\`.
2. Hash function: Sum of ASCII char codes multiplied by their 1-based index modulo 360 (degrees on ring):
   \`hash(s) = (sum(s.charCodeAt(i) * (i + 1))) % 360\`
3. Each virtual node is placed on the ring at its hash position.
4. The target key is hashed using the same formula.
5. The key is assigned to the **first server clockwise** on the ring whose virtual node hash is greater than or equal to the key's hash. If the key hash is greater than all virtual nodes, it wraps around clockwise to the lowest hash on the ring.`,
    examples: [
      {
        input: 'servers = ["srv-A", "srv-B"], vnodes = 2, key = "user_1092"',
        output: '"srv-A"',
        explanation: 'The key hashes to position 140, and the next clockwise virtual node at 155 belongs to srv-A.',
      },
      {
        input: 'servers = ["node-1", "node-2", "node-3"], vnodes = 3, key = "session_xyz"',
        output: '"node-2"',
      },
    ],
    constraints: [
      '1 <= servers.length <= 10',
      '1 <= vnodes <= 5',
      'key is a non-empty alphanumeric string',
    ],
    functionName: 'getAssignedServer',
    starterCode: {
      javascript: `/**
 * @param {string[]} servers
 * @param {number} vnodes
 * @param {string} key
 * @return {string}
 */
function getAssignedServer(servers, vnodes, key) {
  function hash(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i) * (i + 1);
    }
    return sum % 360;
  }

  // 1. Build ring of { hashVal, server }
  const ring = [];
  for (const s of servers) {
    for (let v = 0; v < vnodes; v++) {
      ring.push({ hashVal: hash(\`\${s}#\${v}\`), server: s });
    }
  }

  // Sort ring by hashVal
  ring.sort((a, b) => a.hashVal - b.hashVal);

  const keyHash = hash(key);

  // Find first node >= keyHash
  for (const node of ring) {
    if (node.hashVal >= keyHash) {
      return node.server;
    }
  }

  // Wrap around
  return ring[0].server;
}
`,
      typescript: `function getAssignedServer(servers: string[], vnodes: number, key: string): string {
  function hash(str: string): number {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i) * (i + 1);
    }
    return sum % 360;
  }

  const ring: { hashVal: number; server: string }[] = [];
  for (const s of servers) {
    for (let v = 0; v < vnodes; v++) {
      ring.push({ hashVal: hash(\`\${s}#\${v}\`), server: s });
    }
  }

  ring.sort((a, b) => a.hashVal - b.hashVal);
  const keyHash = hash(key);

  for (const node of ring) {
    if (node.hashVal >= keyHash) return node.server;
  }
  return ring[0].server;
}
`,
      python: `def getAssignedServer(servers: list[str], vnodes: int, key: str) -> str:
    def hash_str(s: str) -> int:
        return sum(ord(c) * (i + 1) for i, c in enumerate(s)) % 360

    ring = []
    for s in servers:
        for v in range(vnodes):
            ring.append((hash_str(f"{s}#{v}"), s))
    
    ring.sort(key=lambda x: x[0])
    key_hash = hash_str(key)
    
    for h, s in ring:
        if h >= key_hash:
            return s
    return ring[0][1]
`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int hashStr(const string& s) {
        int sum = 0;
        for (int i = 0; i < (int)s.length(); i++) {
            sum += (int)s[i] * (i + 1);
        }
        return sum % 360;
    }

    string getAssignedServer(vector<string>& servers, int vnodes, string key) {
        vector<pair<int, string>> ring;
        for (const string& s : servers) {
            for (int v = 0; v < vnodes; v++) {
                ring.push_back({hashStr(s + "#" + to_string(v)), s});
            }
        }
        sort(ring.begin(), ring.end());
        int keyHash = hashStr(key);
        for (const auto& node : ring) {
            if (node.first >= keyHash) return node.second;
        }
        return ring[0].second;
    }
};
`,
      java: `import java.util.*;

class Solution {
    private int hash(String s) {
        int sum = 0;
        for (int i = 0; i < s.length(); i++) {
            sum += (int)s.charAt(i) * (i + 1);
        }
        return sum % 360;
    }

    public String getAssignedServer(String[] servers, int vnodes, String key) {
        List<int[]> list = new ArrayList<>();
        List<String> serverNames = new ArrayList<>();
        for (String s : servers) {
            for (int v = 0; v < vnodes; v++) {
                int h = hash(s + "#" + v);
                list.add(new int[]{h, serverNames.size()});
                serverNames.add(s);
            }
        }
        list.sort((a, b) -> Integer.compare(a[0], b[0]));
        int keyHash = hash(key);
        for (int[] item : list) {
            if (item[0] >= keyHash) return serverNames.get(item[1]);
        }
        return serverNames.get(list.get(0)[1]);
    }
}
`,
      go: `package main

import (
    "fmt"
    "sort"
)

func hashStr(s string) int {
    sum := 0
    for i, c := range s {
        sum += int(c) * (i + 1)
    }
    return sum % 360
}

func getAssignedServer(servers []string, vnodes int, key string) string {
    type Node struct {
        hashVal int
        server  string
    }
    var ring []Node
    for _, s := range servers {
        for v := 0; v < vnodes; v++ {
            ring = append(ring, Node{hashVal: hashStr(fmt.Sprintf("%s#%d", s, v)), server: s})
        }
    }
    sort.Slice(ring, func(i, j int) bool {
        return ring[i].hashVal < ring[j].hashVal
    })
    keyHash := hashStr(key)
    for _, n := range ring {
        if n.hashVal >= keyHash {
            return n.server
        }
    }
    return ring[0].server
}
`,
    },
    testCases: [
      {
        id: 'ch-1',
        input: 'servers = ["srv-A", "srv-B"], vnodes = 2, key = "user_1092"',
        expectedOutput: '"srv-A"',
        rawInput: [['srv-A', 'srv-B'], 2, 'user_1092'],
        rawExpected: 'srv-A',
      },
      {
        id: 'ch-2',
        input: 'servers = ["node-1", "node-2", "node-3"], vnodes = 3, key = "session_xyz"',
        expectedOutput: '"node-2"',
        rawInput: [['node-1', 'node-2', 'node-3'], 3, 'session_xyz'],
        rawExpected: 'node-2',
      },
      {
        id: 'ch-3',
        input: 'servers = ["east-1", "west-1", "eu-central"], vnodes = 2, key = "token_admin_999"',
        expectedOutput: '"east-1"',
        rawInput: [['east-1', 'west-1', 'eu-central'], 2, 'token_admin_999'],
        rawExpected: 'east-1',
      },
    ],
  },
  {
    id: 'token-bucket-rate-limiter',
    title: '2. Token Bucket Rate Limiter',
    difficulty: 'Medium',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 20,
    description: `Implement the **Token Bucket** rate limiting algorithm.

You are given:
- \`requests\`: array of request tuples \`[timestampInSeconds, tokensRequired]\` sorted in ascending timestamp order.
- \`capacity\`: maximum number of tokens the bucket can hold.
- \`refillRatePerSec\`: number of tokens replenished per second.

The bucket starts completely full (\`capacity\` tokens) at the timestamp of the first request.
For each subsequent request, tokens are refilled proportionally to the elapsed time since the previous request:
\`newTokens = elapsedSeconds * refillRatePerSec\` (capped at \`capacity\`).

Return an array of booleans where each element is \`true\` if the request was permitted (sufficient tokens available, which are deducted), or \`false\` if throttled (tokens not deducted).`,
    examples: [
      {
        input: 'requests = [[0, 3], [1, 2], [1, 5]], capacity = 5, refillRate = 2',
        output: '[true, true, false]',
        explanation: 't=0: has 5 tokens, uses 3 (2 left) -> true. t=1: refills 2 (4 total), uses 2 (2 left) -> true. t=1: requires 5 but only 2 available -> false.',
      },
    ],
    constraints: [
      '1 <= requests.length <= 10^4',
      '1 <= capacity <= 1000',
      '1 <= refillRatePerSec <= 100',
    ],
    functionName: 'evaluateRateLimit',
    starterCode: {
      javascript: `/**
 * @param {number[][]} requests
 * @param {number} capacity
 * @param {number} refillRatePerSec
 * @return {boolean[]}
 */
function evaluateRateLimit(requests, capacity, refillRatePerSec) {
  if (!requests || requests.length === 0) return [];
  const results = [];
  let currentTokens = capacity;
  let lastTimestamp = requests[0][0];

  for (const [timestamp, tokensRequired] of requests) {
    const elapsed = Math.max(0, timestamp - lastTimestamp);
    currentTokens = Math.min(capacity, currentTokens + elapsed * refillRatePerSec);
    lastTimestamp = timestamp;

    if (currentTokens >= tokensRequired) {
      currentTokens -= tokensRequired;
      results.push(true);
    } else {
      results.push(false);
    }
  }

  return results;
}
`,
      typescript: `function evaluateRateLimit(requests: number[][], capacity: number, refillRatePerSec: number): boolean[] {
  if (!requests || requests.length === 0) return [];
  const results: boolean[] = [];
  let currentTokens = capacity;
  let lastTimestamp = requests[0][0];

  for (const [timestamp, tokensRequired] of requests) {
    const elapsed = Math.max(0, timestamp - lastTimestamp);
    currentTokens = Math.min(capacity, currentTokens + elapsed * refillRatePerSec);
    lastTimestamp = timestamp;

    if (currentTokens >= tokensRequired) {
      currentTokens -= tokensRequired;
      results.push(true);
    } else {
      results.push(false);
    }
  }

  return results;
}
`,
      python: `def evaluateRateLimit(requests: list[list[int]], capacity: int, refillRatePerSec: int) -> list[bool]:
    if not requests:
        return []
    results = []
    current_tokens = capacity
    last_timestamp = requests[0][0]

    for ts, req_tokens in requests:
        elapsed = max(0, ts - last_timestamp)
        current_tokens = min(capacity, current_tokens + elapsed * refillRatePerSec)
        last_timestamp = ts

        if current_tokens >= req_tokens:
            current_tokens -= req_tokens
            results.append(True)
        else:
            results.append(False)

    return results
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<bool> evaluateRateLimit(vector<vector<int>>& requests, int capacity, int refillRatePerSec) {
        vector<bool> results;
        if (requests.empty()) return results;
        double currentTokens = capacity;
        int lastTimestamp = requests[0][0];

        for (const auto& req : requests) {
            int ts = req[0];
            int tokens = req[1];
            int elapsed = max(0, ts - lastTimestamp);
            currentTokens = min((double)capacity, currentTokens + elapsed * refillRatePerSec);
            lastTimestamp = ts;

            if (currentTokens >= tokens) {
                currentTokens -= tokens;
                results.push_back(true);
            } else {
                results.push_back(false);
            }
        }
        return results;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public boolean[] evaluateRateLimit(int[][] requests, int capacity, int refillRatePerSec) {
        if (requests == null || requests.length == 0) return new boolean[0];
        boolean[] results = new boolean[requests.length];
        double currentTokens = capacity;
        int lastTimestamp = requests[0][0];

        for (int i = 0; i < requests.length; i++) {
            int ts = requests[i][0];
            int tokens = requests[i][1];
            int elapsed = Math.max(0, ts - lastTimestamp);
            currentTokens = Math.min((double)capacity, currentTokens + elapsed * refillRatePerSec);
            lastTimestamp = ts;

            if (currentTokens >= tokens) {
                currentTokens -= tokens;
                results[i] = true;
            } else {
                results[i] = false;
            }
        }
        return results;
    }
}
`,
      go: `package main

func evaluateRateLimit(requests [][]int, capacity int, refillRatePerSec int) []bool {
    if len(requests) == 0 {
        return []bool{}
    }
    var results []bool
    currentTokens := float64(capacity)
    lastTimestamp := requests[0][0]

    for _, req := range requests {
        ts := req[0]
        tokens := float64(req[1])
        elapsed := ts - lastTimestamp
        if elapsed < 0 {
            elapsed = 0
        }
        currentTokens += float64(elapsed * refillRatePerSec)
        if currentTokens > float64(capacity) {
            currentTokens = float64(capacity)
        }
        lastTimestamp = ts

        if currentTokens >= tokens {
            currentTokens -= tokens
            results = append(results, true)
        } else {
            results = append(results, false)
        }
    }
    return results
}
`,
    },
    testCases: [
      {
        id: 'tb-1',
        input: 'requests = [[0, 3], [1, 2], [1, 5]], capacity = 5, refillRate = 2',
        expectedOutput: '[true, true, false]',
        rawInput: [[[0, 3], [1, 2], [1, 5]], 5, 2],
        rawExpected: [true, true, false],
      },
      {
        id: 'tb-2',
        input: 'requests = [[0, 10], [0, 1], [5, 5]], capacity = 10, refillRate = 1',
        expectedOutput: '[true, false, true]',
        rawInput: [[[0, 10], [0, 1], [5, 5]], 10, 1],
        rawExpected: [true, false, true],
      },
    ],
  },
  {
    id: 'url-shortener-encoder',
    title: '3. High-Scale Base62 URL Shortener',
    difficulty: 'Easy',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 15,
    description: `Implement the core encoding and decoding logic of a high-scale URL Shortener service (like bit.ly or TinyURL).

Given a 64-bit non-negative integer ID, encode it into a Base62 alphanumeric string using characters \`0-9a-zA-Z\` (\`0-9\`: 0-9, \`a-z\`: 10-35, \`A-Z\`: 36-61).
Also provide decoding to recover the original integer ID.

Your function should take \`mode\` (\`"encode"\` | \`"decode"\`) and the corresponding input value.`,
    examples: [
      {
        input: 'mode = "encode", value = 125',
        output: '"21"',
        explanation: '125 = 2 * 62^1 + 1 * 62^0 -> "21"',
      },
      {
        input: 'mode = "decode", value = "21"',
        output: '125',
      },
      {
        input: 'mode = "encode", value = 0',
        output: '"0"',
      },
    ],
    constraints: [
      '0 <= id <= 10^14',
      'Alphanumeric character set: 0-9 (0-9), a-z (10-35), A-Z (36-61)',
    ],
    functionName: 'base62Convert',
    starterCode: {
      javascript: `/**
 * @param {string} mode - "encode" | "decode"
 * @param {number|string} value
 * @return {string|number}
 */
function base62Convert(mode, value) {
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (mode === 'encode') {
    let num = Number(value);
    if (num === 0) return '0';
    let res = '';
    while (num > 0) {
      res = CHARS[num % 62] + res;
      num = Math.floor(num / 62);
    }
    return res;
  } else {
    const str = String(value);
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      num = num * 62 + CHARS.indexOf(str[i]);
    }
    return num;
  }
}
`,
      typescript: `function base62Convert(mode: 'encode' | 'decode', value: number | string): string | number {
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (mode === 'encode') {
    let num = Number(value);
    if (num === 0) return '0';
    let res = '';
    while (num > 0) {
      res = CHARS[num % 62] + res;
      num = Math.floor(num / 62);
    }
    return res;
  } else {
    const str = String(value);
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      num = num * 62 + CHARS.indexOf(str[i]);
    }
    return num;
  }
}
`,
      python: `def base62Convert(mode: str, value: any) -> any:
    CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if mode == "encode":
        num = int(value)
        if num == 0:
            return "0"
        res = []
        while num > 0:
            res.append(CHARS[num % 62])
            num //= 62
        return "".join(reversed(res))
    else:
        s = str(value)
        num = 0
        for c in s:
            num = num * 62 + CHARS.index(c)
        return num
`,
      cpp: `#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    string encode(long long num) {
        const string CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (num == 0) return "0";
        string res = "";
        while (num > 0) {
            res += CHARS[num % 62];
            num /= 62;
        }
        reverse(res.begin(), res.end());
        return res;
    }
};
`,
      java: `class Solution {
    private static final String CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public String encode(long num) {
        if (num == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (num > 0) {
            sb.append(CHARS.charAt((int)(num % 62)));
            num /= 62;
        }
        return sb.reverse().toString();
    }
}
`,
      go: `package main

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func base62Convert(mode string, value interface{}) interface{} {
    if mode == "encode" {
        var num int64
        switch v := value.(type) {
        case int:
            num = int64(v)
        case float64:
            num = int64(v)
        }
        if num == 0 {
            return "0"
        }
        var res []byte
        for num > 0 {
            res = append(res, CHARS[num%62])
            num /= 62
        }
        for i, j := 0, len(res)-1; i < j; i, j = i+1, j-1 {
            res[i], res[j] = res[j], res[i]
        }
        return string(res)
    }
    return 0
}
`,
    },
    testCases: [
      {
        id: 'b62-1',
        input: 'mode = "encode", value = 125',
        expectedOutput: '"21"',
        rawInput: ['encode', 125],
        rawExpected: '21',
      },
      {
        id: 'b62-2',
        input: 'mode = "decode", value = "21"',
        expectedOutput: '125',
        rawInput: ['decode', '21'],
        rawExpected: 125,
      },
      {
        id: 'b62-3',
        input: 'mode = "encode", value = 1000000',
        expectedOutput: '"4c92"',
        rawInput: ['encode', 1000000],
        rawExpected: '4c92',
      },
    ],
  },
  {
    id: 'circuit-breaker',
    title: '4. Circuit Breaker State Machine',
    difficulty: 'Hard',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 25,
    description: `Implement a resilient **Circuit Breaker** state machine for inter-service RPC calls.

The circuit breaker has three states:
1. **CLOSED**: Calls pass through. If \`consecutiveFailures >= failureThreshold\`, the breaker trips to **OPEN** and records the trip timestamp.
2. **OPEN**: Calls are blocked immediately (status: \`"BLOCKED"\`). However, if \`currentTimestamp - openTimestamp >= resetTimeoutMs\`, it transitions to **HALF-OPEN** on the next call.
3. **HALF-OPEN**: Probes the backend. If the call succeeds, it recovers back to **CLOSED** (consecutive failures reset to 0). If the call fails, it trips back to **OPEN**.

Given an array of calls \`[[timestampMs, isSuccess]]\`, return the resulting breaker state after each call: \`"CLOSED"\`, \`"OPEN"\`, or \`"HALF-OPEN"\`.`,
    examples: [
      {
        input: 'calls = [[0, false], [10, false], [20, true]], failureThreshold = 2, resetTimeout = 100',
        output: '["CLOSED", "OPEN", "OPEN"]',
        explanation: 'At t=0: 1 fail (CLOSED). At t=10: 2 consecutive fails (trips to OPEN). At t=20: only 10ms passed < 100ms reset (stays OPEN).',
      },
    ],
    constraints: [
      '1 <= calls.length <= 10^3',
      'failureThreshold >= 1',
      'resetTimeoutMs >= 10',
    ],
    functionName: 'simulateCircuitBreaker',
    starterCode: {
      javascript: `/**
 * @param {Array<[number, boolean]>} calls
 * @param {number} failureThreshold
 * @param {number} resetTimeoutMs
 * @return {string[]}
 */
function simulateCircuitBreaker(calls, failureThreshold, resetTimeoutMs) {
  let state = 'CLOSED';
  let consecutiveFailures = 0;
  let openTimestamp = 0;
  const history = [];

  for (const [timestamp, isSuccess] of calls) {
    if (state === 'OPEN') {
      if (timestamp - openTimestamp >= resetTimeoutMs) {
        state = 'HALF-OPEN';
      }
    }

    if (state === 'CLOSED') {
      if (isSuccess) {
        consecutiveFailures = 0;
      } else {
        consecutiveFailures++;
        if (consecutiveFailures >= failureThreshold) {
          state = 'OPEN';
          openTimestamp = timestamp;
        }
      }
    } else if (state === 'HALF-OPEN') {
      if (isSuccess) {
        state = 'CLOSED';
        consecutiveFailures = 0;
      } else {
        state = 'OPEN';
        openTimestamp = timestamp;
      }
    }

    history.push(state);
  }

  return history;
}
`,
      typescript: `function simulateCircuitBreaker(
  calls: [number, boolean][],
  failureThreshold: number,
  resetTimeoutMs: number
): string[] {
  let state: 'CLOSED' | 'OPEN' | 'HALF-OPEN' = 'CLOSED';
  let consecutiveFailures = 0;
  let openTimestamp = 0;
  const history: string[] = [];

  for (const [timestamp, isSuccess] of calls) {
    if (state === 'OPEN' && timestamp - openTimestamp >= resetTimeoutMs) {
      state = 'HALF-OPEN';
    }

    if (state === 'CLOSED') {
      if (isSuccess) {
        consecutiveFailures = 0;
      } else {
        consecutiveFailures++;
        if (consecutiveFailures >= failureThreshold) {
          state = 'OPEN';
          openTimestamp = timestamp;
        }
      }
    } else if (state === 'HALF-OPEN') {
      if (isSuccess) {
        state = 'CLOSED';
        consecutiveFailures = 0;
      } else {
        state = 'OPEN';
        openTimestamp = timestamp;
      }
    }

    history.push(state);
  }

  return history;
}
`,
      python: `def simulateCircuitBreaker(calls: list[list[any]], failureThreshold: int, resetTimeoutMs: int) -> list[str]:
    state = 'CLOSED'
    consecutive_failures = 0
    open_timestamp = 0
    history = []

    for ts, is_success in calls:
        if state == 'OPEN' and ts - open_timestamp >= resetTimeoutMs:
            state = 'HALF-OPEN'

        if state == 'CLOSED':
            if is_success:
                consecutive_failures = 0
            else:
                consecutive_failures += 1
                if consecutive_failures >= failureThreshold:
                    state = 'OPEN'
                    open_timestamp = ts
        elif state == 'HALF-OPEN':
            if is_success:
                state = 'CLOSED'
                consecutive_failures = 0
            else:
                state = 'OPEN'
                open_timestamp = ts

        history.append(state)

    return history
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> simulateCircuitBreaker(vector<pair<int, bool>>& calls, int failureThreshold, int resetTimeoutMs) {
        string state = "CLOSED";
        int consecutiveFailures = 0;
        int openTimestamp = 0;
        vector<string> history;

        for (const auto& call : calls) {
            int ts = call.first;
            bool isSuccess = call.second;

            if (state == "OPEN" && ts - openTimestamp >= resetTimeoutMs) {
                state = "HALF-OPEN";
            }

            if (state == "CLOSED") {
                if (isSuccess) {
                    consecutiveFailures = 0;
                } else {
                    consecutiveFailures++;
                    if (consecutiveFailures >= failureThreshold) {
                        state = "OPEN";
                        openTimestamp = ts;
                    }
                }
            } else if (state == "HALF-OPEN") {
                if (isSuccess) {
                    state = "CLOSED";
                    consecutiveFailures = 0;
                } else {
                    state = "OPEN";
                    openTimestamp = ts;
                }
            }
            history.push_back(state);
        }
        return history;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public List<String> simulateCircuitBreaker(int[][] calls, int failureThreshold, int resetTimeoutMs) {
        String state = "CLOSED";
        int consecutiveFailures = 0;
        int openTimestamp = 0;
        List<String> history = new ArrayList<>();

        for (int[] call : calls) {
            int ts = call[0];
            boolean isSuccess = call[1] == 1;

            if (state.equals("OPEN") && ts - openTimestamp >= resetTimeoutMs) {
                state = "HALF-OPEN";
            }

            if (state.equals("CLOSED")) {
                if (isSuccess) {
                    consecutiveFailures = 0;
                } else {
                    consecutiveFailures++;
                    if (consecutiveFailures >= failureThreshold) {
                        state = "OPEN";
                        openTimestamp = ts;
                    }
                }
            } else if (state.equals("HALF-OPEN")) {
                if (isSuccess) {
                    state = "CLOSED";
                    consecutiveFailures = 0;
                } else {
                    state = "OPEN";
                    openTimestamp = ts;
                }
            }
            history.add(state);
        }
        return history;
    }
}
`,
      go: `package main

func simulateCircuitBreaker(calls [][]interface{}, failureThreshold int, resetTimeoutMs int) []string {
    state := "CLOSED"
    consecutiveFailures := 0
    openTimestamp := 0
    var history []string

    for _, call := range calls {
        ts := int(call[0].(float64))
        isSuccess := call[1].(bool)

        if state == "OPEN" && ts-openTimestamp >= resetTimeoutMs {
            state = "HALF-OPEN"
        }

        if state == "CLOSED" {
            if isSuccess {
                consecutiveFailures = 0
            } else {
                consecutiveFailures++
                if consecutiveFailures >= failureThreshold {
                    state = "OPEN"
                    openTimestamp = ts
                }
            }
        } else if state == "HALF-OPEN" {
            if isSuccess {
                state = "CLOSED"
                consecutiveFailures = 0
            } else {
                state = "OPEN"
                openTimestamp = ts
            }
        }
        history = append(history, state)
    }
    return history
}
`,
    },
    testCases: [
      {
        id: 'cb-1',
        input: 'calls = [[0, false], [10, false], [20, true]], failureThreshold = 2, resetTimeout = 100',
        expectedOutput: '["CLOSED", "OPEN", "OPEN"]',
        rawInput: [[[0, false], [10, false], [20, true]], 2, 100],
        rawExpected: ['CLOSED', 'OPEN', 'OPEN'],
      },
      {
        id: 'cb-2',
        input: 'calls = [[0, false], [10, false], [120, true], [130, true]], failureThreshold = 2, resetTimeout = 100',
        expectedOutput: '["CLOSED", "OPEN", "CLOSED", "CLOSED"]',
        rawInput: [[[0, false], [10, false], [120, true], [130, true]], 2, 100],
        rawExpected: ['CLOSED', 'OPEN', 'CLOSED', 'CLOSED'],
      },
    ],
  },
  {
    id: 'distributed-lock-lease',
    title: '5. Distributed Lock Lease with Fencing Tokens',
    difficulty: 'Hard',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 30,
    description: `Implement a high-scale Distributed Lock Lease Manager with monotonic fencing tokens (similar to Redlock, ZooKeeper ephemeral z-nodes, and Chubby locks) to prevent split-brain write conflicts across concurrent microservices.

### Supported Operations:
1. \`["ACQUIRE", resource, client, ttlMs, timestamp]\`:
   - If the resource is unheld OR its current lease has expired (\`timestamp >= expiresAt\`), grant the lock to \`client\`.
   - Increment a global 64-bit monotonically increasing \`fencingToken\` (starts at 1).
   - Set \`expiresAt = timestamp + ttlMs\`.
   - Return \`[true, fencingToken]\`.
   - If the resource is already held by another client (or same client) and not yet expired (\`timestamp < expiresAt\`), reject and return \`[false, 0]\`.

2. \`["RENEW", resource, client, ttlMs, timestamp]\`:
   - If the lock is actively held by \`client\` and not expired (\`timestamp < expiresAt\`), extend lease to \`expiresAt = timestamp + ttlMs\`.
   - Return \`[true, currentFencingToken]\`.
   - If lock is not held by \`client\` or has expired, return \`[false, 0]\`.

3. \`["RELEASE", resource, client, 0, timestamp]\`:
   - If the lock is actively held by \`client\` and not expired, delete the lock.
   - Return \`[true, currentFencingToken]\`.
   - Otherwise return \`[false, 0]\`.

Return an array of \`[status: boolean, fencingToken: number]\` for each request in order.`,
    examples: [
      {
        input: 'requests = [["ACQUIRE", "db-row-1", "worker-1", 1000, 100], ["ACQUIRE", "db-row-1", "worker-2", 1000, 200], ["RENEW", "db-row-1", "worker-1", 1500, 500], ["RELEASE", "db-row-1", "worker-1", 0, 1200]]',
        output: '[[true, 1], [false, 0], [true, 1], [true, 1]]',
        explanation: 'Worker 1 acquires lock at ts=100 with token 1. Worker 2 is rejected at ts=200. Worker 1 renews at ts=500. Worker 1 successfully releases at ts=1200.',
      },
      {
        input: 'requests = [["ACQUIRE", "res-A", "client-A", 500, 0], ["ACQUIRE", "res-A", "client-B", 500, 600]]',
        output: '[[true, 1], [true, 2]]',
        explanation: 'Client A acquires at ts=0 and expires at ts=500. Client B acquires at ts=600 with new fencing token 2.',
      },
    ],
    constraints: [
      '1 <= requests.length <= 100',
      'ttlMs >= 10',
      'timestamps are strictly non-decreasing',
    ],
    functionName: 'manageDistributedLock',
    starterCode: {
      javascript: `/**
 * @param {Array<[string, string, string, number, number]>} requests
 * @return {Array<[boolean, number]>}
 */
function manageDistributedLock(requests) {
  let nextFencingToken = 1;
  const locks = new Map(); // resource -> { client, expiresAt, token }
  const results = [];

  for (const [action, resource, client, ttl, timestamp] of requests) {
    const current = locks.get(resource);
    const isExpired = !current || timestamp >= current.expiresAt;

    if (action === 'ACQUIRE') {
      if (isExpired) {
        const token = nextFencingToken++;
        locks.set(resource, {
          client,
          expiresAt: timestamp + ttl,
          token,
        });
        results.push([true, token]);
      } else {
        results.push([false, 0]);
      }
    } else if (action === 'RENEW') {
      if (!isExpired && current.client === client) {
        current.expiresAt = timestamp + ttl;
        results.push([true, current.token]);
      } else {
        results.push([false, 0]);
      }
    } else if (action === 'RELEASE') {
      if (!isExpired && current.client === client) {
        const token = current.token;
        locks.delete(resource);
        results.push([true, token]);
      } else {
        results.push([false, 0]);
      }
    }
  }

  return results;
}
`,
      typescript: `function manageDistributedLock(
  requests: [string, string, string, number, number][]
): [boolean, number][] {
  let nextFencingToken = 1;
  interface LockInfo {
    client: string;
    expiresAt: number;
    token: number;
  }
  const locks = new Map<string, LockInfo>();
  const results: [boolean, number][] = [];

  for (const [action, resource, client, ttl, timestamp] of requests) {
    const current = locks.get(resource);
    const isExpired = !current || timestamp >= current.expiresAt;

    if (action === 'ACQUIRE') {
      if (isExpired) {
        const token = nextFencingToken++;
        locks.set(resource, {
          client,
          expiresAt: timestamp + ttl,
          token,
        });
        results.push([true, token]);
      } else {
        results.push([false, 0]);
      }
    } else if (action === 'RENEW') {
      if (!isExpired && current && current.client === client) {
        current.expiresAt = timestamp + ttl;
        results.push([true, current.token]);
      } else {
        results.push([false, 0]);
      }
    } else if (action === 'RELEASE') {
      if (!isExpired && current && current.client === client) {
        const token = current.token;
        locks.delete(resource);
        results.push([true, token]);
      } else {
        results.push([false, 0]);
      }
    }
  }

  return results;
}
`,
      python: `def manageDistributedLock(requests: list[list[any]]) -> list[list[any]]:
    next_token = 1
    locks = {} # resource -> {'client': c, 'expiresAt': exp, 'token': t}
    results = []

    for action, resource, client, ttl, timestamp in requests:
        current = locks.get(resource)
        is_expired = current is None or timestamp >= current['expiresAt']

        if action == 'ACQUIRE':
            if is_expired:
                token = next_token
                next_token += 1
                locks[resource] = {
                    'client': client,
                    'expiresAt': timestamp + ttl,
                    'token': token
                }
                results.append([True, token])
            else:
                results.append([False, 0])
        elif action == 'RENEW':
            if not is_expired and current['client'] == client:
                current['expiresAt'] = timestamp + ttl
                results.append([True, current['token']])
            else:
                results.append([False, 0])
        elif action == 'RELEASE':
            if not is_expired and current['client'] == client:
                token = current['token']
                del locks[resource]
                results.append([True, token])
            else:
                results.append([False, 0])

    return results
`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

struct LockInfo {
    string client;
    long long expiresAt;
    int token;
};

class Solution {
public:
    vector<pair<bool, int>> manageDistributedLock(const vector<vector<string>>& requests) {
        int nextToken = 1;
        unordered_map<string, LockInfo> locks;
        vector<pair<bool, int>> results;

        for (const auto& req : requests) {
            string action = req[0];
            string resource = req[1];
            string client = req[2];
            long long ttl = stoll(req[3]);
            long long ts = stoll(req[4]);

            bool exists = locks.count(resource);
            bool isExpired = !exists || ts >= locks[resource].expiresAt;

            if (action == "ACQUIRE") {
                if (isExpired) {
                    int token = nextToken++;
                    locks[resource] = {client, ts + ttl, token};
                    results.push_back({true, token});
                } else {
                    results.push_back({false, 0});
                }
            } else if (action == "RENEW") {
                if (!isExpired && locks[resource].client == client) {
                    locks[resource].expiresAt = ts + ttl;
                    results.push_back({true, locks[resource].token});
                } else {
                    results.push_back({false, 0});
                }
            } else if (action == "RELEASE") {
                if (!isExpired && locks[resource].client == client) {
                    int token = locks[resource].token;
                    locks.erase(resource);
                    results.push_back({true, token});
                } else {
                    results.push_back({false, 0});
                }
            }
        }
        return results;
    }
};
`,
      java: `import java.util.*;

class Solution {
    static class LockInfo {
        String client;
        long expiresAt;
        int token;
        LockInfo(String client, long expiresAt, int token) {
            this.client = client;
            this.expiresAt = expiresAt;
            this.token = token;
        }
    }

    public List<Object[]> manageDistributedLock(List<Object[]> requests) {
        int nextToken = 1;
        Map<String, LockInfo> locks = new HashMap<>();
        List<Object[]> results = new ArrayList<>();

        for (Object[] req : requests) {
            String action = (String) req[0];
            String resource = (String) req[1];
            String client = (String) req[2];
            long ttl = ((Number) req[3]).longValue();
            long ts = ((Number) req[4]).longValue();

            LockInfo current = locks.get(resource);
            boolean isExpired = current == null || ts >= current.expiresAt;

            if ("ACQUIRE".equals(action)) {
                if (isExpired) {
                    int token = nextToken++;
                    locks.put(resource, new LockInfo(client, ts + ttl, token));
                    results.add(new Object[]{true, token});
                } else {
                    results.add(new Object[]{false, 0});
                }
            } else if ("RENEW".equals(action)) {
                if (!isExpired && current.client.equals(client)) {
                    current.expiresAt = ts + ttl;
                    results.add(new Object[]{true, current.token});
                } else {
                    results.add(new Object[]{false, 0});
                }
            } else if ("RELEASE".equals(action)) {
                if (!isExpired && current.client.equals(client)) {
                    int token = current.token;
                    locks.remove(resource);
                    results.add(new Object[]{true, token});
                } else {
                    results.add(new Object[]{false, 0});
                }
            }
        }
        return results;
    }
}
`,
      go: `package main

type LockInfo struct {
    client    string
    expiresAt int64
    token     int
}

func manageDistributedLock(requests [][]interface{}) [][]interface{} {
    nextToken := 1
    locks := make(map[string]LockInfo)
    var results [][]interface{}

    for _, req := range requests {
        action := req[0].(string)
        resource := req[1].(string)
        client := req[2].(string)
        ttl := int64(req[3].(float64))
        ts := int64(req[4].(float64))

        curr, exists := locks[resource]
        isExpired := !exists || ts >= curr.expiresAt

        if action == "ACQUIRE" {
            if isExpired {
                token := nextToken
                nextToken++
                locks[resource] = LockInfo{client: client, expiresAt: ts + ttl, token: token}
                results = append(results, []interface{}{true, token})
            } else {
                results = append(results, []interface{}{false, 0})
            }
        } else if action == "RENEW" {
            if !isExpired && curr.client == client {
                curr.expiresAt = ts + ttl
                locks[resource] = curr
                results = append(results, []interface{}{true, curr.token})
            } else {
                results = append(results, []interface{}{false, 0})
            }
        } else if action == "RELEASE" {
            if !isExpired && curr.client == client {
                delete(locks, resource)
                results = append(results, []interface{}{true, curr.token})
            } else {
                results = append(results, []interface{}{false, 0})
            }
        }
    }
    return results
}
`,
    },
    testCases: [
      {
        id: 'dl-1',
        input: 'requests = [["ACQUIRE", "db-row-1", "worker-1", 1000, 100], ["ACQUIRE", "db-row-1", "worker-2", 1000, 200], ["RENEW", "db-row-1", "worker-1", 1500, 500], ["RELEASE", "db-row-1", "worker-1", 0, 1200]]',
        expectedOutput: '[[true, 1], [false, 0], [true, 1], [true, 1]]',
        rawInput: [[['ACQUIRE', 'db-row-1', 'worker-1', 1000, 100], ['ACQUIRE', 'db-row-1', 'worker-2', 1000, 200], ['RENEW', 'db-row-1', 'worker-1', 1500, 500], ['RELEASE', 'db-row-1', 'worker-1', 0, 1200]]],
        rawExpected: [[true, 1], [false, 0], [true, 1], [true, 1]],
      },
      {
        id: 'dl-2',
        input: 'requests = [["ACQUIRE", "res-A", "client-A", 500, 0], ["ACQUIRE", "res-A", "client-B", 500, 600]]',
        expectedOutput: '[[true, 1], [true, 2]]',
        rawInput: [[['ACQUIRE', 'res-A', 'client-A', 500, 0], ['ACQUIRE', 'res-A', 'client-B', 500, 600]]],
        rawExpected: [[true, 1], [true, 2]],
      },
    ],
  },
  {
    id: 'bloom-filter-cache',
    title: '6. Distributed Cache Bloom Filter Membership',
    difficulty: 'Medium',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 25,
    description: `Implement a space-efficient Distributed Bloom Filter to protect databases against Cache Penetration attacks (queries for nonexistent keys hitting disk).

### Hashing Formula:
Given bit array size \`m\` and an array of integer seeds \`hashSeeds = [s0, s1, ...]\`, the bit index for key string \`str\` using seed \`s\` is:
\`hash(str, s) = (sum(str.charCodeAt(i) * (s * 31 + i + 1))) % m\`

### Supported Operations:
1. \`["ADD", key]\`: Computes hash position for every seed \`s\` in \`hashSeeds\` and sets those bit positions to 1. Returns \`true\`.
2. \`["CHECK", key]\`: Verifies if all bit positions for \`key\` are set to 1. Returns \`true\` (probably in set), or \`false\` (definitely not in set).

Return a boolean array with the output of each operation.`,
    examples: [
      {
        input: 'm = 64, hashSeeds = [3, 7], operations = [["ADD", "user:101"], ["CHECK", "user:101"], ["CHECK", "user:999"]]',
        output: '[true, true, false]',
        explanation: 'user:101 is added setting bits. CHECK user:101 confirms bits are present. CHECK user:999 finds unset bits, returning false.',
      },
    ],
    constraints: [
      '16 <= m <= 1024',
      '1 <= hashSeeds.length <= 5',
      '1 <= operations.length <= 50',
    ],
    functionName: 'simulateBloomFilter',
    starterCode: {
      javascript: `/**
 * @param {number} m
 * @param {number[]} hashSeeds
 * @param {Array<[string, string]>} operations
 * @return {boolean[]}
 */
function simulateBloomFilter(m, hashSeeds, operations) {
  const bits = new Array(m).fill(false);

  function getHash(str, seed) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i) * (seed * 31 + i + 1);
    }
    return sum % m;
  }

  const results = [];
  for (const [op, key] of operations) {
    if (op === 'ADD') {
      for (const s of hashSeeds) {
        bits[getHash(key, s)] = true;
      }
      results.push(true);
    } else if (op === 'CHECK') {
      let present = true;
      for (const s of hashSeeds) {
        if (!bits[getHash(key, s)]) {
          present = false;
          break;
        }
      }
      results.push(present);
    }
  }

  return results;
}
`,
      typescript: `function simulateBloomFilter(
  m: number,
  hashSeeds: number[],
  operations: [string, string][]
): boolean[] {
  const bits: boolean[] = new Array(m).fill(false);

  function getHash(str: string, seed: number): number {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i) * (seed * 31 + i + 1);
    }
    return sum % m;
  }

  const results: boolean[] = [];
  for (const [op, key] of operations) {
    if (op === 'ADD') {
      for (const s of hashSeeds) {
        bits[getHash(key, s)] = true;
      }
      results.push(true);
    } else if (op === 'CHECK') {
      let present = true;
      for (const s of hashSeeds) {
        if (!bits[getHash(key, s)]) {
          present = false;
          break;
        }
      }
      results.push(present);
    }
  }

  return results;
}
`,
      python: `def simulateBloomFilter(m: int, hashSeeds: list[int], operations: list[list[str]]) -> list[bool]:
    bits = [False] * m

    def get_hash(s: str, seed: int) -> int:
        total = 0
        for i, ch in enumerate(s):
            total += ord(ch) * (seed * 31 + i + 1)
        return total % m

    results = []
    for op, key in operations:
        if op == 'ADD':
            for seed in hashSeeds:
                bits[get_hash(key, seed)] = True
            results.append(True)
        elif op == 'CHECK':
            present = all(bits[get_hash(key, seed)] for seed in hashSeeds)
            results.append(present)

    return results
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int getHash(const string& str, int seed, int m) {
        long long sum = 0;
        for (int i = 0; i < (int)str.length(); i++) {
            sum += (long long)str[i] * (seed * 31 + i + 1);
        }
        return sum % m;
    }

    vector<bool> simulateBloomFilter(int m, vector<int>& hashSeeds, vector<pair<string, string>>& operations) {
        vector<bool> bits(m, false);
        vector<bool> results;

        for (const auto& op : operations) {
            if (op.first == "ADD") {
                for (int s : hashSeeds) {
                    bits[getHash(op.second, s, m)] = true;
                }
                results.push_back(true);
            } else {
                bool present = true;
                for (int s : hashSeeds) {
                    if (!bits[getHash(op.second, s, m)]) {
                        present = false;
                        break;
                    }
                }
                results.push_back(present);
            }
        }
        return results;
    }
};
`,
      java: `import java.util.*;

class Solution {
    private int getHash(String str, int seed, int m) {
        long sum = 0;
        for (int i = 0; i < str.length(); i++) {
            sum += (long) str.charAt(i) * (seed * 31 + i + 1);
        }
        return (int) (sum % m);
    }

    public List<Boolean> simulateBloomFilter(int m, int[] hashSeeds, List<String[]> operations) {
        boolean[] bits = new boolean[m];
        List<Boolean> results = new ArrayList<>();

        for (String[] op : operations) {
            String type = op[0];
            String key = op[1];

            if ("ADD".equals(type)) {
                for (int s : hashSeeds) {
                    bits[getHash(key, s, m)] = true;
                }
                results.add(true);
            } else {
                boolean present = true;
                for (int s : hashSeeds) {
                    if (!bits[getHash(key, s, m)]) {
                        present = false;
                        break;
                    }
                }
                results.add(present);
            }
        }
        return results;
    }
}
`,
      go: `package main

func simulateBloomFilter(m int, hashSeeds []int, operations [][]string) []bool {
    bits := make([]bool, m)
    var results []bool

    getHash := func(s string, seed int) int {
        sum := 0
        for i, c := range s {
            sum += int(c) * (seed*31 + i + 1)
        }
        return sum % m
    }

    for _, op := range operations {
        t := op[0]
        key := op[1]

        if t == "ADD" {
            for _, s := range hashSeeds {
                bits[getHash(key, s)] = true
            }
            results = append(results, true)
        } else {
            present := true
            for _, s := range hashSeeds {
                if !bits[getHash(key, s)] {
                    present = false
                    break
                }
            }
            results = append(results, present)
        }
    }
    return results
}
`,
    },
    testCases: [
      {
        id: 'bf-1',
        input: 'm = 64, hashSeeds = [3, 7], operations = [["ADD", "user:101"], ["CHECK", "user:101"], ["CHECK", "user:999"]]',
        expectedOutput: '[true, true, false]',
        rawInput: [64, [3, 7], [['ADD', 'user:101'], ['CHECK', 'user:101'], ['CHECK', 'user:999']]],
        rawExpected: [true, true, false],
      },
      {
        id: 'bf-2',
        input: 'm = 128, hashSeeds = [2, 5, 11], operations = [["ADD", "order-abc"], ["ADD", "order-xyz"], ["CHECK", "order-abc"], ["CHECK", "order-xyz"], ["CHECK", "order-not-found"]]',
        expectedOutput: '[true, true, true, true, false]',
        rawInput: [128, [2, 5, 11], [['ADD', 'order-abc'], ['ADD', 'order-xyz'], ['CHECK', 'order-abc'], ['CHECK', 'order-xyz'], ['CHECK', 'order-not-found']]],
        rawExpected: [true, true, true, true, false],
      },
    ],
  },
  {
    id: 'weighted-load-balancer',
    title: '7. Smooth Weighted Round-Robin Load Balancer',
    difficulty: 'Hard',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 30,
    description: `Implement the industry standard **Smooth Weighted Round-Robin** algorithm (used in NGINX, Envoy, and HAProxy) to evenly disperse incoming traffic without bursty clustered routing.

### Algorithm per incoming request:
1. Filter out servers where \`healthy === false\`.
2. Compute \`totalHealthyWeight = sum(s.weight for s in healthyServers)\`.
3. For each healthy server: \`currentWeight += weight\`.
4. Pick the healthy server with the largest \`currentWeight\`. (If tied, pick the one appearing first in the original server list).
5. For the chosen server: \`currentWeight -= totalHealthyWeight\`.
6. Return the chosen server's ID.

Return an array of server IDs for \`requestCount\` sequential requests.`,
    examples: [
      {
        input: 'servers = [{"id":"srv-A","weight":4,"healthy":true}, {"id":"srv-B","weight":2,"healthy":true}, {"id":"srv-C","weight":1,"healthy":true}], requestCount = 7',
        output: '["srv-A", "srv-B", "srv-A", "srv-A", "srv-C", "srv-B", "srv-A"]',
        explanation: 'Evenly distributes requests in ratio 4:2:1 with zero traffic starvation.',
      },
      {
        input: 'servers = [{"id":"node-1","weight":3,"healthy":true}, {"id":"node-2","weight":3,"healthy":false}], requestCount = 3',
        output: '["node-1", "node-1", "node-1"]',
        explanation: 'node-2 is unhealthy, so all traffic smoothly routes to node-1.',
      },
    ],
    constraints: [
      '1 <= servers.length <= 10',
      'weight >= 1',
      'requestCount >= 1',
    ],
    functionName: 'routeRequests',
    starterCode: {
      javascript: `/**
 * @param {Array<{id: string, weight: number, healthy: boolean}>} servers
 * @param {number} requestCount
 * @return {string[]}
 */
function routeRequests(servers, requestCount) {
  const healthy = servers.filter(s => s.healthy);
  if (healthy.length === 0) return [];

  const totalHealthyWeight = healthy.reduce((acc, s) => acc + s.weight, 0);
  const currentWeights = new Map(healthy.map(s => [s.id, 0]));
  const routed = [];

  for (let i = 0; i < requestCount; i++) {
    // 1. Increase current weights
    for (const s of healthy) {
      currentWeights.set(s.id, currentWeights.get(s.id) + s.weight);
    }

    // 2. Find server with max current weight
    let bestServer = healthy[0];
    let maxWeight = currentWeights.get(bestServer.id);

    for (let j = 1; j < healthy.length; j++) {
      const s = healthy[j];
      const w = currentWeights.get(s.id);
      if (w > maxWeight) {
        maxWeight = w;
        bestServer = s;
      }
    }

    // 3. Decrement best server by total weight
    currentWeights.set(bestServer.id, maxWeight - totalHealthyWeight);
    routed.push(bestServer.id);
  }

  return routed;
}
`,
      typescript: `interface ServerNode {
  id: string;
  weight: number;
  healthy: boolean;
}

function routeRequests(servers: ServerNode[], requestCount: number): string[] {
  const healthy = servers.filter(s => s.healthy);
  if (healthy.length === 0) return [];

  const totalHealthyWeight = healthy.reduce((acc, s) => acc + s.weight, 0);
  const currentWeights = new Map<string, number>(healthy.map(s => [s.id, 0]));
  const routed: string[] = [];

  for (let i = 0; i < requestCount; i++) {
    for (const s of healthy) {
      currentWeights.set(s.id, (currentWeights.get(s.id) || 0) + s.weight);
    }

    let bestServer = healthy[0];
    let maxWeight = currentWeights.get(bestServer.id)!;

    for (let j = 1; j < healthy.length; j++) {
      const s = healthy[j];
      const w = currentWeights.get(s.id)!;
      if (w > maxWeight) {
        maxWeight = w;
        bestServer = s;
      }
    }

    currentWeights.set(bestServer.id, maxWeight - totalHealthyWeight);
    routed.push(bestServer.id);
  }

  return routed;
}
`,
      python: `def routeRequests(servers: list[dict], requestCount: int) -> list[str]:
    healthy = [s for s in servers if s.get('healthy', True)]
    if not healthy:
        return []

    total_weight = sum(s['weight'] for s in healthy)
    current_weights = {s['id']: 0 for s in healthy}
    routed = []

    for _ in range(requestCount):
        for s in healthy:
            current_weights[s['id']] += s['weight']

        best_server = healthy[0]
        max_w = current_weights[best_server['id']]

        for s in healthy[1:]:
            if current_weights[s['id']] > max_w:
                max_w = current_weights[s['id']]
                best_server = s

        current_weights[best_server['id']] -= total_weight
        routed.append(best_server['id'])

    return routed
`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

struct ServerNode {
    string id;
    int weight;
    bool healthy;
};

class Solution {
public:
    vector<string> routeRequests(vector<ServerNode>& servers, int requestCount) {
        vector<ServerNode> healthy;
        int totalWeight = 0;
        for (const auto& s : servers) {
            if (s.healthy) {
                healthy.push_back(s);
                totalWeight += s.weight;
            }
        }
        if (healthy.empty()) return {};

        unordered_map<string, int> currentWeights;
        vector<string> routed;

        for (int i = 0; i < requestCount; i++) {
            for (const auto& s : healthy) {
                currentWeights[s.id] += s.weight;
            }

            ServerNode best = healthy[0];
            int maxW = currentWeights[best.id];

            for (size_t j = 1; j < healthy.size(); j++) {
                if (currentWeights[healthy[j].id] > maxW) {
                    maxW = currentWeights[healthy[j].id];
                    best = healthy[j];
                }
            }

            currentWeights[best.id] -= totalWeight;
            routed.push_back(best.id);
        }

        return routed;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public static class ServerNode {
        public String id;
        public int weight;
        public boolean healthy;
    }

    public List<String> routeRequests(List<Map<String, Object>> servers, int requestCount) {
        List<Map<String, Object>> healthy = new ArrayList<>();
        int totalWeight = 0;
        for (Map<String, Object> s : servers) {
            if (Boolean.TRUE.equals(s.get("healthy"))) {
                healthy.add(s);
                totalWeight += ((Number) s.get("weight")).intValue();
            }
        }
        if (healthy.isEmpty()) return Collections.emptyList();

        Map<String, Integer> currentWeights = new HashMap<>();
        for (Map<String, Object> s : healthy) {
            currentWeights.put((String) s.get("id"), 0);
        }

        List<String> routed = new ArrayList<>();

        for (int i = 0; i < requestCount; i++) {
            for (Map<String, Object> s : healthy) {
                String id = (String) s.get("id");
                int w = ((Number) s.get("weight")).intValue();
                currentWeights.put(id, currentWeights.get(id) + w);
            }

            Map<String, Object> best = healthy.get(0);
            int maxW = currentWeights.get((String) best.get("id"));

            for (int j = 1; j < healthy.size(); j++) {
                Map<String, Object> s = healthy.get(j);
                int w = currentWeights.get((String) s.get("id"));
                if (w > maxW) {
                    maxW = w;
                    best = s;
                }
            }

            String bestId = (String) best.get("id");
            currentWeights.put(bestId, maxW - totalWeight);
            routed.add(bestId);
        }

        return routed;
    }
}
`,
      go: `package main

type ServerNode struct {
    Id      string
    Weight  int
    Healthy bool
}

func routeRequests(servers []map[string]interface{}, requestCount int) []string {
    var healthy []map[string]interface{}
    totalWeight := 0
    for _, s := range servers {
        if s["healthy"].(bool) {
            healthy = append(healthy, s)
            totalWeight += int(s["weight"].(float64))
        }
    }
    if len(healthy) == 0 {
        return nil
    }

    currentWeights := make(map[string]int)
    var routed []string

    for i := 0; i < requestCount; i++ {
        for _, s := range healthy {
            id := s["id"].(string)
            w := int(s["weight"].(float64))
            currentWeights[id] += w
        }

        best := healthy[0]
        maxW := currentWeights[best["id"].(string)]

        for j := 1; j < len(healthy); j++ {
            s := healthy[j]
            w := currentWeights[s["id"].(string)]
            if w > maxW {
                maxW = w
                best = s
            }
        }

        bestId := best["id"].(string)
        currentWeights[bestId] -= totalWeight
        routed = append(routed, bestId)
    }

    return routed
}
`,
    },
    testCases: [
      {
        id: 'wr-1',
        input: 'servers = [{"id":"srv-A","weight":4,"healthy":true}, {"id":"srv-B","weight":2,"healthy":true}, {"id":"srv-C","weight":1,"healthy":true}], requestCount = 7',
        expectedOutput: '["srv-A", "srv-B", "srv-A", "srv-A", "srv-C", "srv-B", "srv-A"]',
        rawInput: [
          [
            { id: 'srv-A', weight: 4, healthy: true },
            { id: 'srv-B', weight: 2, healthy: true },
            { id: 'srv-C', weight: 1, healthy: true },
          ],
          7,
        ],
        rawExpected: ['srv-A', 'srv-B', 'srv-A', 'srv-A', 'srv-C', 'srv-B', 'srv-A'],
      },
      {
        id: 'wr-2',
        input: 'servers = [{"id":"node-1","weight":3,"healthy":true}, {"id":"node-2","weight":3,"healthy":false}], requestCount = 3',
        expectedOutput: '["node-1", "node-1", "node-1"]',
        rawInput: [
          [
            { id: 'node-1', weight: 3, healthy: true },
            { id: 'node-2', weight: 3, healthy: false },
          ],
          3,
        ],
        rawExpected: ['node-1', 'node-1', 'node-1'],
      },
    ],
  },
  {
    id: 'distributed-two-phase-commit',
    title: '8. Two-Phase Commit (2PC) Distributed Transaction Coordinator',
    difficulty: 'Hard',
    category: 'System Design & Distributed Systems',
    trackId: 'system_design',
    timeEstimateMinutes: 30,
    description: `Implement a 2-Phase Commit (2PC) consensus coordinator for atomic transactions spanning multi-region database shards.

### Two-Phase Protocol:
1. **Prepare Phase**:
   - Coordinator sends PREPARE request to all \`participants\`.
   - A participant fails to prepare if they are listed in \`timeoutNodes\` (network timeout) OR their vote in \`votes\` is \`false\`.
   - If **ALL** participants vote \`true\` and none timeout, the coordinator decides \`"COMMIT"\`.
   - If **ANY** participant votes \`false\` or times out, the coordinator decides \`"ABORT"\`.

2. **Commit / Abort Phase**:
   - Return transaction outcome string: \`"COMMITTED"\` or \`"ABORTED: <REASON>"\` where reason is:
     - \`"NODE_TIMEOUT: <nodeId>"\` (first timed out node in list order), or
     - \`"VOTE_REJECTED: <nodeId>"\` (first node voting false in list order).

Given a list of transactions, evaluate each and return their decision strings.`,
    examples: [
      {
        input: 'transactions = [{"txId":"tx-101","participants":["shard-1","shard-2"],"votes":{"shard-1":true,"shard-2":true},"timeoutNodes":[]}]',
        output: '["tx-101: COMMITTED"]',
        explanation: 'All shards voted yes with no timeouts, so transaction is committed.',
      },
      {
        input: 'transactions = [{"txId":"tx-102","participants":["shard-1","shard-2"],"votes":{"shard-1":true,"shard-2":false},"timeoutNodes":[]}]',
        output: '["tx-102: ABORTED (VOTE_REJECTED: shard-2)"]',
        explanation: 'shard-2 rejected the prepare phase, triggering an abort.',
      },
    ],
    constraints: [
      '1 <= transactions.length <= 20',
      '1 <= participants.length <= 10',
    ],
    functionName: 'coordinate2PC',
    starterCode: {
      javascript: `/**
 * @param {Array<{txId: string, participants: string[], votes: Record<string, boolean>, timeoutNodes: string[]}>} transactions
 * @return {string[]}
 */
function coordinate2PC(transactions) {
  const results = [];

  for (const tx of transactions) {
    const { txId, participants, votes, timeoutNodes } = tx;
    const timeoutSet = new Set(timeoutNodes || []);
    let abortReason = null;

    for (const node of participants) {
      if (timeoutSet.has(node)) {
        abortReason = \`NODE_TIMEOUT: \${node}\`;
        break;
      }
      if (!votes[node]) {
        abortReason = \`VOTE_REJECTED: \${node}\`;
        break;
      }
    }

    if (abortReason) {
      results.push(\`\${txId}: ABORTED (\${abortReason})\`);
    } else {
      results.push(\`\${txId}: COMMITTED\`);
    }
  }

  return results;
}
`,
      typescript: `interface TransactionRequest {
  txId: string;
  participants: string[];
  votes: Record<string, boolean>;
  timeoutNodes: string[];
}

function coordinate2PC(transactions: TransactionRequest[]): string[] {
  const results: string[] = [];

  for (const tx of transactions) {
    const { txId, participants, votes, timeoutNodes } = tx;
    const timeoutSet = new Set(timeoutNodes || []);
    let abortReason: string | null = null;

    for (const node of participants) {
      if (timeoutSet.has(node)) {
        abortReason = \`NODE_TIMEOUT: \${node}\`;
        break;
      }
      if (!votes[node]) {
        abortReason = \`VOTE_REJECTED: \${node}\`;
        break;
      }
    }

    if (abortReason) {
      results.push(\`\${txId}: ABORTED (\${abortReason})\`);
    } else {
      results.push(\`\${txId}: COMMITTED\`);
    }
  }

  return results;
}
`,
      python: `def coordinate2PC(transactions: list[dict]) -> list[str]:
    results = []
    for tx in transactions:
        tx_id = tx['txId']
        participants = tx['participants']
        votes = tx.get('votes', {})
        timeouts = set(tx.get('timeoutNodes', []))
        
        abort_reason = None
        for node in participants:
            if node in timeouts:
                abort_reason = f"NODE_TIMEOUT: {node}"
                break
            if not votes.get(node, False):
                abort_reason = f"VOTE_REJECTED: {node}"
                break
                
        if abort_reason:
            results.append(f"{tx_id}: ABORTED ({abort_reason})")
        else:
            results.append(f"{tx_id}: COMMITTED")
            
    return results
`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
using namespace std;

struct TransactionRequest {
    string txId;
    vector<string> participants;
    unordered_map<string, bool> votes;
    vector<string> timeoutNodes;
};

class Solution {
public:
    vector<string> coordinate2PC(const vector<TransactionRequest>& transactions) {
        vector<string> results;
        for (const auto& tx : transactions) {
            unordered_set<string> timeouts(tx.timeoutNodes.begin(), tx.timeoutNodes.end());
            string abortReason = "";

            for (const auto& node : tx.participants) {
                if (timeouts.count(node)) {
                    abortReason = "NODE_TIMEOUT: " + node;
                    break;
                }
                auto it = tx.votes.find(node);
                if (it == tx.votes.end() || !it->second) {
                    abortReason = "VOTE_REJECTED: " + node;
                    break;
                }
            }

            if (!abortReason.empty()) {
                results.push_back(tx.txId + ": ABORTED (" + abortReason + ")");
            } else {
                results.push_back(tx.txId + ": COMMITTED");
            }
        }
        return results;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public List<String> coordinate2PC(List<Map<String, Object>> transactions) {
        List<String> results = new ArrayList<>();

        for (Map<String, Object> tx : transactions) {
            String txId = (String) tx.get("txId");
            List<String> participants = (List<String>) tx.get("participants");
            Map<String, Boolean> votes = (Map<String, Boolean>) tx.get("votes");
            List<String> timeoutList = (List<String>) tx.get("timeoutNodes");
            Set<String> timeouts = new HashSet<>(timeoutList != null ? timeoutList : Collections.emptyList());

            String abortReason = null;

            for (String node : participants) {
                if (timeouts.contains(node)) {
                    abortReason = "NODE_TIMEOUT: " + node;
                    break;
                }
                if (votes == null || !Boolean.TRUE.equals(votes.get(node))) {
                    abortReason = "VOTE_REJECTED: " + node;
                    break;
                }
            }

            if (abortReason != null) {
                results.add(txId + ": ABORTED (" + abortReason + ")");
            } else {
                results.add(txId + ": COMMITTED");
            }
        }

        return results;
    }
}
`,
      go: `package main

import "fmt"

func coordinate2PC(transactions []map[string]interface{}) []string {
    var results []string

    for _, tx := range transactions {
        txId := tx["txId"].(string)
        parts := tx["participants"].([]interface{})
        votes := tx["votes"].(map[string]interface{})
        timeoutsRaw := tx["timeoutNodes"].([]interface{})
        
        timeouts := make(map[string]bool)
        for _, t := range timeoutsRaw {
            timeouts[t.(string)] = true
        }

        abortReason := ""
        for _, p := range parts {
            node := p.(string)
            if timeouts[node] {
                abortReason = fmt.Sprintf("NODE_TIMEOUT: %s", node)
                break
            }
            v, exists := votes[node]
            if !exists || !v.(bool) {
                abortReason = fmt.Sprintf("VOTE_REJECTED: %s", node)
                break
            }
        }

        if abortReason != "" {
            results = append(results, fmt.Sprintf("%s: ABORTED (%s)", txId, abortReason))
        } else {
            results = append(results, fmt.Sprintf("%s: COMMITTED", txId))
        }
    }

    return results
}
`,
    },
    testCases: [
      {
        id: '2pc-1',
        input: 'transactions = [{"txId":"tx-101","participants":["shard-1","shard-2"],"votes":{"shard-1":true,"shard-2":true},"timeoutNodes":[]}]',
        expectedOutput: '["tx-101: COMMITTED"]',
        rawInput: [
          [
            {
              txId: 'tx-101',
              participants: ['shard-1', 'shard-2'],
              votes: { 'shard-1': true, 'shard-2': true },
              timeoutNodes: [],
            },
          ],
        ],
        rawExpected: ['tx-101: COMMITTED'],
      },
      {
        id: '2pc-2',
        input: 'transactions = [{"txId":"tx-102","participants":["shard-1","shard-2","shard-3"],"votes":{"shard-1":true,"shard-2":false,"shard-3":true},"timeoutNodes":[]}, {"txId":"tx-103","participants":["shard-A","shard-B"],"votes":{"shard-A":true,"shard-B":true},"timeoutNodes":["shard-B"]}]',
        expectedOutput: '["tx-102: ABORTED (VOTE_REJECTED: shard-2)", "tx-103: ABORTED (NODE_TIMEOUT: shard-B)"]',
        rawInput: [
          [
            {
              txId: 'tx-102',
              participants: ['shard-1', 'shard-2', 'shard-3'],
              votes: { 'shard-1': true, 'shard-2': false, 'shard-3': true },
              timeoutNodes: [],
            },
            {
              txId: 'tx-103',
              participants: ['shard-A', 'shard-B'],
              votes: { 'shard-A': true, 'shard-B': true },
              timeoutNodes: ['shard-B'],
            },
          ],
        ],
        rawExpected: [
          'tx-102: ABORTED (VOTE_REJECTED: shard-2)',
          'tx-103: ABORTED (NODE_TIMEOUT: shard-B)',
        ],
      },
    ],
  },
];

