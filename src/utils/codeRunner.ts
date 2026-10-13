import { ExecutionResponse, Question, SupportedLanguage, TestCase, TestResult } from '../types/interview';

function deepEqual(a: any, b: any, questionId?: string): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;

  // Handle floating point tolerances for numeric calculations (ML/Stats)
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= 0.01;
  }

  // Handle special case for group anagrams where order of groups and items inside may differ
  if (questionId === 'group-anagrams' && Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const normalizeGroup = (group: any[]) => [...group].sort().join(',');
    const normA = a.map((g: any[]) => (Array.isArray(g) ? normalizeGroup(g) : String(g))).sort();
    const normB = b.map((g: any[]) => (Array.isArray(g) ? normalizeGroup(g) : String(g))).sort();
    return JSON.stringify(normA) === JSON.stringify(normB);
  }

  // Handle twoSum order agnostic (indices order match)
  if (questionId === 'two-sum' && Array.isArray(a) && Array.isArray(b) && a.length === 2 && b.length === 2) {
    if (JSON.stringify(a) === JSON.stringify(b)) return true;
    if (JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())) return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], questionId)) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key], questionId)) return false;
    }
    return true;
  }

  return false;
}

function safeStringify(val: any): string {
  if (val === undefined) return 'undefined';
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Strips basic TypeScript type annotations for fast client-side execution fallback.
 */
function stripTypeScript(tsCode: string): string {
  return tsCode
    .replace(/:\s*(?:number|string|boolean|any|void|never|unknown|object)(?:\[\])?(?=[,\)\s=;])/g, '')
    .replace(/:\s*[A-Z][A-Za-z0-9_<>\[\],\s|&]+(?=[,\)\s=;])/g, '')
    .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
    .replace(/type\s+\w+\s*=[\s\S]*?;/g, '')
    .replace(/as\s+[A-Za-z0-9_<>\[\]]+/g, '');
}

/**
 * Executes JavaScript code safely in the browser sandbox.
 */
export async function runJavaScriptLocally(
  userCode: string,
  question: Question
): Promise<ExecutionResponse> {
  const results: TestResult[] = [];

  try {
    // Check basic syntax
    new Function(userCode);
  } catch (err: any) {
    return {
      success: false,
      results: [],
      allPassed: false,
      passCount: 0,
      totalCount: question.testCases.length,
      compilerError: `Syntax Error: ${err.message}`,
    };
  }

  for (let i = 0; i < question.testCases.length; i++) {
    const tc = question.testCases[i];
    const startTime = performance.now();
    let stdoutLogs: string[] = [];
    let passed = false;
    let actualDisplay = '';
    let error: string | undefined;

    try {
      // Execute in isolated function scope with captured logs
      const runner = new Function(
        '__tcInput',
        '__fnName',
        `
        const console = {
          log: (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          warn: (...args) => __logs.push('[warn] ' + args.join(' ')),
          error: (...args) => __logs.push('[error] ' + args.join(' '))
        };
        const __logs = [];
        ${userCode}
        
        if (typeof eval(__fnName) !== 'function') {
          throw new Error('Function ' + __fnName + ' is not defined. Please implement ' + __fnName + '.');
        }
        
        const __result = eval(__fnName)(...__tcInput);
        return { result: __result, logs: __logs };
      `
      );

      // Deep clone inputs so mutation doesn't taint subsequent operations
      const clonedInput = JSON.parse(JSON.stringify(tc.rawInput));
      const res = runner(clonedInput, question.functionName);
      stdoutLogs = res.logs || [];
      const actual = res.result;
      actualDisplay = safeStringify(actual);

      passed = deepEqual(actual, tc.rawExpected, question.id);
    } catch (err: any) {
      error = err.message || String(err);
      actualDisplay = `Error: ${error}`;
      passed = false;
    }

    const duration = Math.max(1, Math.round(performance.now() - startTime));

    results.push({
      testCaseId: tc.id,
      passed,
      inputDisplay: tc.input,
      expectedDisplay: tc.expectedOutput,
      actualDisplay,
      executionTimeMs: duration,
      stdout: stdoutLogs.join('\n'),
      error,
    });
  }

  const passCount = results.filter((r) => r.passed).length;

  return {
    success: true,
    results,
    allPassed: passCount === results.length,
    passCount,
    totalCount: results.length,
  };
}

/**
 * Builds TypeScript runner script for Piston.
 */
function buildTypeScriptTestHarness(userCode: string, question: Question): string {
  const testCasesJson = JSON.stringify(
    question.testCases.map((tc) => ({
      id: tc.id,
      input: tc.rawInput,
      expected: tc.rawExpected,
      inputDisplay: tc.input,
      expectedDisplay: tc.expectedOutput,
    }))
  );

  return `
// --- User Code Start ---
${userCode}
// --- User Code End ---

const TEST_CASES = ${testCasesJson};
const FUNCTION_NAME = "${question.functionName}";
const QUESTION_ID = "${question.id}";

function deepEqual(a: any, b: any, questionId?: string): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  if (questionId === 'group-anagrams' && Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const normalizeGroup = (group: any[]) => [...group].sort().join(',');
    const normA = a.map((g: any[]) => (Array.isArray(g) ? normalizeGroup(g) : String(g))).sort();
    const normB = b.map((g: any[]) => (Array.isArray(g) ? normalizeGroup(g) : String(g))).sort();
    return JSON.stringify(normA) === JSON.stringify(normB);
  }
  if (questionId === 'two-sum' && Array.isArray(a) && Array.isArray(b) && a.length === 2 && b.length === 2) {
    if (JSON.stringify(a) === JSON.stringify(b)) return true;
    if (JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())) return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], questionId)) return false;
    }
    return true;
  }
  return false;
}

const results: any[] = [];
const fn = (globalThis as any)[FUNCTION_NAME] || (eval('typeof ' + FUNCTION_NAME + ' === "function" ? ' + FUNCTION_NAME + ' : null'));

if (!fn) {
  console.log(JSON.stringify({
    compilerError: "Function '" + FUNCTION_NAME + "' is not defined. Please implement '" + FUNCTION_NAME + "'."
  }));
  process.exit(0);
}

for (const tc of TEST_CASES) {
  const start = Date.now();
  let passed = false;
  let actualDisplay = "";
  let errorMsg: string | undefined;
  let logs: string[] = [];

  const originalLog = console.log;
  console.log = (...args: any[]) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  try {
    const cloned = JSON.parse(JSON.stringify(tc.input));
    const res = fn(...cloned);
    actualDisplay = JSON.stringify(res);
    passed = deepEqual(res, tc.expected, QUESTION_ID);
  } catch (err: any) {
    errorMsg = err?.message || String(err);
    actualDisplay = "Error: " + errorMsg;
    passed = false;
  } finally {
    console.log = originalLog;
  }

  const duration = Math.max(1, Date.now() - start);

  results.push({
    testCaseId: tc.id,
    passed,
    inputDisplay: tc.inputDisplay,
    expectedDisplay: tc.expectedDisplay,
    actualDisplay,
    executionTimeMs: duration,
    stdout: logs.join('\\n'),
    error: errorMsg
  });
}

console.log("__PISTON_JSON_START__" + JSON.stringify({
  success: true,
  results: results
}) + "__PISTON_JSON_END__");
`;
}

/**
 * Builds Python runner script to execute user code and test cases against Piston API.
 */
function buildPythonTestHarness(userCode: string, question: Question): string {
  const testCasesJson = JSON.stringify(
    question.testCases.map((tc) => ({
      id: tc.id,
      input: tc.rawInput,
      expected: tc.rawExpected,
      inputDisplay: tc.input,
      expectedDisplay: tc.expectedOutput,
    }))
  );

  return `
import sys
import json
import time
import io
from typing import List, Dict, Any, Optional

# --- User Code Start ---
${userCode}
# --- User Code End ---

TEST_CASES = json.loads('''${testCasesJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')
FUNCTION_NAME = "${question.functionName}"
QUESTION_ID = "${question.id}"

def deep_equal(a, b, q_id):
    if a == b:
        return True
    if q_id == "group-anagrams" and isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            return False
        def norm(group):
            return sorted(list(group)) if isinstance(group, list) else [group]
        norm_a = sorted([norm(g) for g in a])
        norm_b = sorted([norm(g) for g in b])
        return norm_a == norm_b
    if q_id == "two-sum" and isinstance(a, list) and isinstance(b, list) and len(a) == 2 and len(b) == 2:
        return sorted(a) == sorted(b)
    return False

results = []

if FUNCTION_NAME not in globals() or not callable(globals()[FUNCTION_NAME]):
    print(json.dumps({
        "compilerError": f"Function '{FUNCTION_NAME}' is not defined. Please implement '{FUNCTION_NAME}'."
    }))
    sys.exit(0)

target_fn = globals()[FUNCTION_NAME]

for tc in TEST_CASES:
    captured_stdout = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = captured_stdout
    
    start_time = time.perf_counter()
    passed = False
    actual_display = ""
    error_msg = None
    
    try:
        args = tc["input"]
        # Call the target function with unpacked args
        res = target_fn(*args)
        actual_display = json.dumps(res)
        passed = deep_equal(res, tc["expected"], QUESTION_ID)
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        actual_display = f"Error: {error_msg}"
        passed = False
    finally:
        sys.stdout = old_stdout
        duration_ms = max(1, round((time.perf_counter() - start_time) * 1000))
    
    results.append({
        "testCaseId": tc["id"],
        "passed": passed,
        "inputDisplay": tc["inputDisplay"],
        "expectedDisplay": tc["expectedDisplay"],
        "actualDisplay": actual_display,
        "executionTimeMs": duration_ms,
        "stdout": captured_stdout.getvalue().strip(),
        "error": error_msg
    })

print("__PISTON_JSON_START__" + json.dumps({
    "success": True,
    "results": results
}) + "__PISTON_JSON_END__")
`;
}

/**
 * Builds C++ runner harness.
 */
function buildCppTestHarness(userCode: string, question: Question): string {
  const testCases = question.testCases;

  let testExecutionCalls = '';

  testCases.forEach((tc, idx) => {
    const inputDisplay = tc.input.replace(/"/g, '\\"');
    const expectedDisplay = tc.expectedOutput.replace(/"/g, '\\"');

    if (question.id === 'two-sum') {
      const numsArr = (tc.rawInput[0] as number[]).join(',');
      const target = tc.rawInput[1];
      const expArr = (tc.rawExpected as number[]).join(',');
      testExecutionCalls += `
    {
        vector<int> nums = {${numsArr}};
        int target = ${target};
        vector<int> expected = {${expArr}};
        auto t0 = chrono::high_resolution_clock::now();
        string err = "";
        string actualStr = "";
        bool passed = false;
        try {
            vector<int> res = sol.twoSum(nums, target);
            actualStr = vecToIntString(res);
            passed = (res == expected);
            if (!passed && res.size() == 2 && expected.size() == 2) {
                vector<int> sortedRes = res;
                vector<int> sortedExp = expected;
                sort(sortedRes.begin(), sortedRes.end());
                sort(sortedExp.begin(), sortedExp.end());
                if (sortedRes == sortedExp) passed = true;
            }
        } catch (const exception& e) {
            err = e.what();
            actualStr = "Error: " + err;
        } catch (...) {
            err = "Runtime Exception";
            actualStr = "Error: Runtime Exception";
        }
        auto t1 = chrono::high_resolution_clock::now();
        int ms = max(1, (int)chrono::duration_cast<chrono::milliseconds>(t1 - t0).count());
        addResult("${tc.id}", passed, "${inputDisplay}", "${expectedDisplay}", actualStr, ms, err);
    }
      `;
    } else if (question.id === 'valid-palindrome') {
      const sVal = (tc.rawInput[0] as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const expVal = tc.rawExpected ? 'true' : 'false';
      testExecutionCalls += `
    {
        string s = "${sVal}";
        bool expected = ${expVal};
        auto t0 = chrono::high_resolution_clock::now();
        string err = "";
        string actualStr = "";
        bool passed = false;
        try {
            bool res = sol.isPalindrome(s);
            actualStr = res ? "true" : "false";
            passed = (res == expected);
        } catch (const exception& e) {
            err = e.what();
            actualStr = "Error: " + err;
        } catch (...) {
            err = "Runtime Exception";
            actualStr = "Error: Runtime Exception";
        }
        auto t1 = chrono::high_resolution_clock::now();
        int ms = max(1, (int)chrono::duration_cast<chrono::milliseconds>(t1 - t0).count());
        addResult("${tc.id}", passed, "${inputDisplay}", "${expectedDisplay}", actualStr, ms, err);
    }
      `;
    } else if (question.id === 'longest-substring-without-repeating-characters') {
      const sVal = (tc.rawInput[0] as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const expVal = tc.rawExpected;
      testExecutionCalls += `
    {
        string s = "${sVal}";
        int expected = ${expVal};
        auto t0 = chrono::high_resolution_clock::now();
        string err = "";
        string actualStr = "";
        bool passed = false;
        try {
            int res = sol.lengthOfLongestSubstring(s);
            actualStr = to_string(res);
            passed = (res == expected);
        } catch (const exception& e) {
            err = e.what();
            actualStr = "Error: " + err;
        } catch (...) {
            err = "Runtime Exception";
            actualStr = "Error: Runtime Exception";
        }
        auto t1 = chrono::high_resolution_clock::now();
        int ms = max(1, (int)chrono::duration_cast<chrono::milliseconds>(t1 - t0).count());
        addResult("${tc.id}", passed, "${inputDisplay}", "${expectedDisplay}", actualStr, ms, err);
    }
      `;
    } else if (question.id === 'merge-intervals') {
      const intervalsList = (tc.rawInput[0] as number[][])
        .map((p) => `{${p[0]}, ${p[1]}}`)
        .join(',');
      const expList = (tc.rawExpected as number[][])
        .map((p) => `{${p[0]}, ${p[1]}}`)
        .join(',');
      testExecutionCalls += `
    {
        vector<vector<int>> intervals = {${intervalsList}};
        vector<vector<int>> expected = {${expList}};
        auto t0 = chrono::high_resolution_clock::now();
        string err = "";
        string actualStr = "";
        bool passed = false;
        try {
            vector<vector<int>> res = sol.merge(intervals);
            actualStr = vec2dIntString(res);
            passed = (res == expected);
        } catch (const exception& e) {
            err = e.what();
            actualStr = "Error: " + err;
        } catch (...) {
            err = "Runtime Exception";
            actualStr = "Error: Runtime Exception";
        }
        auto t1 = chrono::high_resolution_clock::now();
        int ms = max(1, (int)chrono::duration_cast<chrono::milliseconds>(t1 - t0).count());
        addResult("${tc.id}", passed, "${inputDisplay}", "${expectedDisplay}", actualStr, ms, err);
    }
      `;
    } else if (question.id === 'group-anagrams') {
      const strList = (tc.rawInput[0] as string[])
        .map((s) => `"${s.replace(/"/g, '\\"')}"`)
        .join(',');
      testExecutionCalls += `
    {
        vector<string> strs = {${strList}};
        auto t0 = chrono::high_resolution_clock::now();
        string err = "";
        string actualStr = "";
        bool passed = false;
        try {
            vector<vector<string>> res = sol.groupAnagrams(strs);
            actualStr = vec2dStrString(res);
            passed = compareGroupAnagrams(res, strs);
        } catch (const exception& e) {
            err = e.what();
            actualStr = "Error: " + err;
        } catch (...) {
            err = "Runtime Exception";
            actualStr = "Error: Runtime Exception";
        }
        auto t1 = chrono::high_resolution_clock::now();
        int ms = max(1, (int)chrono::duration_cast<chrono::milliseconds>(t1 - t0).count());
        addResult("${tc.id}", passed, "${inputDisplay}", "${expectedDisplay}", actualStr, ms, err);
    }
      `;
    }
  });

  return `
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <chrono>
#include <sstream>

using namespace std;

// --- User Code Start ---
${userCode}
// --- User Code End ---

static string escapeJson(const string& s) {
    ostringstream o;
    for (char c : s) {
        if (c == '"') o << "\\\\" << '"';
        else if (c == '\\\\') o << "\\\\\\\\";
        else if (c == '\\b') o << "\\\\b";
        else if (c == '\\f') o << "\\\\f";
        else if (c == '\\n') o << "\\\\n";
        else if (c == '\\r') o << "\\\\r";
        else if (c == '\\t') o << "\\\\t";
        else if ('\\x00' <= c && c <= '\\x1f') {
            o << "\\\\u" << hex << (int)c;
        } else {
            o << c;
        }
    }
    return o.str();
}

static string vecToIntString(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) {
        s += to_string(v[i]);
        if (i + 1 < v.size()) s += ", ";
    }
    s += "]";
    return s;
}

static string vec2dIntString(const vector<vector<int>>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) {
        s += vecToIntString(v[i]);
        if (i + 1 < v.size()) s += ", ";
    }
    s += "]";
    return s;
}

static string vec2dStrString(const vector<vector<string>>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) {
        s += "[";
        for (size_t j = 0; j < v[i].size(); j++) {
            s += "\\"" + v[i][j] + "\\"";
            if (j + 1 < v[i].size()) s += ", ";
        }
        s += "]";
        if (i + 1 < v.size()) s += ", ";
    }
    s += "]";
    return s;
}

static bool compareGroupAnagrams(vector<vector<string>> actual, const vector<string>& original) {
    unordered_map<string, vector<string>> expectedMap;
    for (const string& w : original) {
        string k = w;
        sort(k.begin(), k.end());
        expectedMap[k].push_back(w);
    }
    if (actual.size() != expectedMap.size()) return false;
    for (auto& group : actual) {
        if (group.empty()) return false;
        string k = group[0];
        sort(k.begin(), k.end());
        if (expectedMap.find(k) == expectedMap.end()) return false;
        if (expectedMap[k].size() != group.size()) return false;
        vector<string> sortedAct = group;
        vector<string> sortedExp = expectedMap[k];
        sort(sortedAct.begin(), sortedAct.end());
        sort(sortedExp.begin(), sortedExp.end());
        if (sortedAct != sortedExp) return false;
    }
    return true;
}

struct TestResultEntry {
    string testCaseId;
    bool passed;
    string inputDisplay;
    string expectedDisplay;
    string actualDisplay;
    int executionTimeMs;
    string error;
};

static vector<TestResultEntry> resultsList;

static void addResult(string id, bool passed, string input, string exp, string actual, int ms, string err) {
    resultsList.push_back({id, passed, input, exp, actual, ms, err});
}

int main() {
    Solution sol;
    ${testExecutionCalls}

    cout << "__PISTON_JSON_START__{\\"success\\":true,\\"results\\":[";
    for (size_t i = 0; i < resultsList.size(); i++) {
        const auto& r = resultsList[i];
        cout << "{"
             << "\\"testCaseId\\":\\"" << r.testCaseId << "\\","
             << "\\"passed\\":" << (r.passed ? "true" : "false") << ","
             << "\\"inputDisplay\\":\\"" << escapeJson(r.inputDisplay) << "\\","
             << "\\"expectedDisplay\\":\\"" << escapeJson(r.expectedDisplay) << "\\","
             << "\\"actualDisplay\\":\\"" << escapeJson(r.actualDisplay) << "\\","
             << "\\"executionTimeMs\\":" << r.executionTimeMs << ","
             << "\\"stdout\\":\\"\\","
             << "\\"error\\":\\"" << escapeJson(r.error) << "\\""
             << "}";
        if (i + 1 < resultsList.size()) cout << ",";
    }
    cout << "]}__PISTON_JSON_END__" << endl;
    return 0;
}
`;
}

/**
 * Builds Java runner harness.
 */
function buildJavaTestHarness(userCode: string, question: Question): string {
  const testCases = question.testCases;
  let testCalls = '';

  testCases.forEach((tc) => {
    const inputDisplay = tc.input.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const expectedDisplay = tc.expectedOutput.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    if (question.id === 'two-sum') {
      const nums = (tc.rawInput[0] as number[]).join(',');
      const target = tc.rawInput[1];
      const expected = (tc.rawExpected as number[]).join(',');
      testCalls += `
        runTest("${tc.id}", "${inputDisplay}", "${expectedDisplay}", () -> {
            int[] nums = new int[]{${nums}};
            int target = ${target};
            int[] expected = new int[]{${expected}};
            int[] res = sol.twoSum(nums, target);
            String actual = Arrays.toString(res);
            boolean pass = Arrays.equals(res, expected);
            if (!pass && res != null && res.length == 2) {
                int[] sRes = res.clone();
                int[] sExp = expected.clone();
                Arrays.sort(sRes);
                Arrays.sort(sExp);
                pass = Arrays.equals(sRes, sExp);
            }
            return new Object[]{pass, actual};
        });
      `;
    } else if (question.id === 'valid-palindrome') {
      const sVal = (tc.rawInput[0] as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const expVal = tc.rawExpected ? 'true' : 'false';
      testCalls += `
        runTest("${tc.id}", "${inputDisplay}", "${expectedDisplay}", () -> {
            String s = "${sVal}";
            boolean expected = ${expVal};
            boolean res = sol.isPalindrome(s);
            return new Object[]{res == expected, String.valueOf(res)};
        });
      `;
    } else if (question.id === 'longest-substring-without-repeating-characters') {
      const sVal = (tc.rawInput[0] as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const expVal = tc.rawExpected;
      testCalls += `
        runTest("${tc.id}", "${inputDisplay}", "${expectedDisplay}", () -> {
            String s = "${sVal}";
            int expected = ${expVal};
            int res = sol.lengthOfLongestSubstring(s);
            return new Object[]{res == expected, String.valueOf(res)};
        });
      `;
    } else if (question.id === 'merge-intervals') {
      const pairs = (tc.rawInput[0] as number[][]).map((p) => `new int[]{${p[0]}, ${p[1]}}`).join(',');
      const expPairs = (tc.rawExpected as number[][]).map((p) => `new int[]{${p[0]}, ${p[1]}}`).join(',');
      testCalls += `
        runTest("${tc.id}", "${inputDisplay}", "${expectedDisplay}", () -> {
            int[][] intervals = new int[][]{${pairs}};
            int[][] expected = new int[][]{${expPairs}};
            int[][] res = sol.merge(intervals);
            String actual = Arrays.deepToString(res);
            boolean pass = Arrays.deepEquals(res, expected);
            return new Object[]{pass, actual};
        });
      `;
    } else if (question.id === 'group-anagrams') {
      const strs = (tc.rawInput[0] as string[]).map((s) => `"${s.replace(/"/g, '\\"')}"`).join(',');
      testCalls += `
        runTest("${tc.id}", "${inputDisplay}", "${expectedDisplay}", () -> {
            String[] strs = new String[]{${strs}};
            List<List<String>> res = sol.groupAnagrams(strs);
            String actual = String.valueOf(res);
            boolean pass = checkGroupAnagrams(res, strs);
            return new Object[]{pass, actual};
        });
      `;
    }
  });

  return `
import java.util.*;

// --- User Code Start ---
${userCode}
// --- User Code End ---

public class Main {
    interface TestCaseRunner {
        Object[] run() throws Exception;
    }

    static List<String> resultJsonList = new ArrayList<>();

    static boolean checkGroupAnagrams(List<List<String>> actual, String[] original) {
        if (actual == null) return false;
        Map<String, List<String>> map = new HashMap<>();
        for (String w : original) {
            char[] c = w.toCharArray();
            Arrays.sort(c);
            String k = new String(c);
            map.computeIfAbsent(k, k1 -> new ArrayList<>()).add(w);
        }
        if (actual.size() != map.size()) return false;
        for (List<String> group : actual) {
            if (group == null || group.isEmpty()) return false;
            char[] c = group.get(0).toCharArray();
            Arrays.sort(c);
            String k = new String(c);
            if (!map.containsKey(k)) return false;
            List<String> exp = new ArrayList<>(map.get(k));
            List<String> act = new ArrayList<>(group);
            Collections.sort(exp);
            Collections.sort(act);
            if (!exp.equals(act)) return false;
        }
        return true;
    }

    static void runTest(String id, String input, String exp, TestCaseRunner runner) {
        long t0 = System.nanoTime();
        boolean pass = false;
        String actual = "";
        String err = "";
        try {
            Object[] out = runner.run();
            pass = (Boolean) out[0];
            actual = String.valueOf(out[1]);
        } catch (Throwable e) {
            err = e.getMessage() != null ? e.getMessage() : e.toString();
            actual = "Error: " + err;
            pass = false;
        }
        long ms = Math.max(1, (System.nanoTime() - t0) / 1_000_000);

        String json = "{"
            + "\\"testCaseId\\":\\"" + id + "\\","
            + "\\"passed\\":" + pass + ","
            + "\\"inputDisplay\\":\\"" + escape(input) + "\\","
            + "\\"expectedDisplay\\":\\"" + escape(exp) + "\\","
            + "\\"actualDisplay\\":\\"" + escape(actual) + "\\","
            + "\\"executionTimeMs\\":" + ms + ","
            + "\\"stdout\\":\\"\\","
            + "\\"error\\":\\"" + escape(err) + "\\""
            + "}";
        resultJsonList.add(json);
    }

    static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"").replace("\\n", "\\\\n").replace("\\r", "");
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        ${testCalls}

        System.out.print("__PISTON_JSON_START__{\\"success\\":true,\\"results\\":[");
        System.out.print(String.join(",", resultJsonList));
        System.out.println("]}__PISTON_JSON_END__");
    }
}
`;
}

/**
 * Builds Go runner harness.
 */
function buildGoTestHarness(userCode: string, question: Question): string {
  const testCases = question.testCases;
  let testCalls = '';

  testCases.forEach((tc) => {
    const inputDisplay = tc.input.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const expectedDisplay = tc.expectedOutput.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    if (question.id === 'two-sum') {
      const nums = (tc.rawInput[0] as number[]).join(', ');
      const target = tc.rawInput[1];
      const expected = (tc.rawExpected as number[]).join(', ');
      testCalls += `
    {
        nums := []int{${nums}}
        target := ${target}
        expected := []int{${expected}}
        t0 := time.Now()
        res := twoSum(nums, target)
        ms := int(time.Since(t0).Milliseconds())
        if ms < 1 { ms = 1 }
        
        actBytes, _ := json.Marshal(res)
        pass := len(res) == len(expected)
        if pass && len(res) == 2 {
            rS := append([]int{}, res...)
            eS := append([]int{}, expected...)
            sort.Ints(rS)
            sort.Ints(eS)
            pass = rS[0] == eS[0] && rS[1] == eS[1]
        }
        addResult("${tc.id}", pass, "${inputDisplay}", "${expectedDisplay}", string(actBytes), ms, "")
    }
      `;
    } else if (question.id === 'valid-palindrome') {
      const sVal = (tc.rawInput[0] as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const expVal = tc.rawExpected ? 'true' : 'false';
      testCalls += `
    {
        s := "${sVal}"
        expected := ${expVal}
        t0 := time.Now()
        res := isPalindrome(s)
        ms := int(time.Since(t0).Milliseconds())
        if ms < 1 { ms = 1 }
        addResult("${tc.id}", res == expected, "${inputDisplay}", "${expectedDisplay}", fmt.Sprintf("%v", res), ms, "")
    }
      `;
    } else if (question.id === 'longest-substring-without-repeating-characters') {
      const sVal = (tc.rawInput[0] as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const expVal = tc.rawExpected;
      testCalls += `
    {
        s := "${sVal}"
        expected := ${expVal}
        t0 := time.Now()
        res := lengthOfLongestSubstring(s)
        ms := int(time.Since(t0).Milliseconds())
        if ms < 1 { ms = 1 }
        addResult("${tc.id}", res == expected, "${inputDisplay}", "${expectedDisplay}", fmt.Sprintf("%v", res), ms, "")
    }
      `;
    } else if (question.id === 'merge-intervals') {
      const pairs = (tc.rawInput[0] as number[][]).map((p) => `[]int{${p[0]}, ${p[1]}}`).join(', ');
      const expPairs = (tc.rawExpected as number[][]).map((p) => `[]int{${p[0]}, ${p[1]}}`).join(', ');
      testCalls += `
    {
        intervals := [][]int{${pairs}}
        expected := [][]int{${expPairs}}
        t0 := time.Now()
        res := merge(intervals)
        ms := int(time.Since(t0).Milliseconds())
        if ms < 1 { ms = 1 }
        actBytes, _ := json.Marshal(res)
        expBytes, _ := json.Marshal(expected)
        pass := string(actBytes) == string(expBytes)
        addResult("${tc.id}", pass, "${inputDisplay}", "${expectedDisplay}", string(actBytes), ms, "")
    }
      `;
    } else if (question.id === 'group-anagrams') {
      const strs = (tc.rawInput[0] as string[]).map((s) => `"${s.replace(/"/g, '\\"')}"`).join(', ');
      testCalls += `
    {
        strs := []string{${strs}}
        t0 := time.Now()
        res := groupAnagrams(strs)
        ms := int(time.Since(t0).Milliseconds())
        if ms < 1 { ms = 1 }
        actBytes, _ := json.Marshal(res)
        pass := checkGroupAnagrams(res, strs)
        addResult("${tc.id}", pass, "${inputDisplay}", "${expectedDisplay}", string(actBytes), ms, "")
    }
      `;
    }
  });

  return `
package main

import (
    "encoding/json"
    "fmt"
    "sort"
    "strings"
    "time"
)

// --- User Code Start ---
${userCode}
// --- User Code End ---

type TestResult struct {
    TestCaseID      string \`json:"testCaseId"\`
    Passed          bool   \`json:"passed"\`
    InputDisplay    string \`json:"inputDisplay"\`
    ExpectedDisplay string \`json:"expectedDisplay"\`
    ActualDisplay   string \`json:"actualDisplay"\`
    ExecutionTimeMS int    \`json:"executionTimeMs"\`
    Stdout          string \`json:"stdout"\`
    Error           string \`json:"error"\`
}

var results []TestResult

func addResult(id string, pass bool, in, exp, act string, ms int, err string) {
    results = append(results, TestResult{
        TestCaseID:      id,
        Passed:          pass,
        InputDisplay:    in,
        ExpectedDisplay: exp,
        ActualDisplay:   act,
        ExecutionTimeMS: ms,
        Error:           err,
    })
}

func checkGroupAnagrams(actual [][]string, original []string) bool {
    groupMap := make(map[string][]string)
    for _, w := range original {
        chars := strings.Split(w, "")
        sort.Strings(chars)
        k := strings.Join(chars, "")
        groupMap[k] = append(groupMap[k], w)
    }
    if len(actual) != len(groupMap) {
        return false
    }
    for _, g := range actual {
        if len(g) == 0 {
            return false
        }
        chars := strings.Split(g[0], "")
        sort.Strings(chars)
        k := strings.Join(chars, "")
        exp, ok := groupMap[k]
        if !ok || len(exp) != len(g) {
            return false
        }
        gSorted := append([]string{}, g...)
        eSorted := append([]string{}, exp...)
        sort.Strings(gSorted)
        sort.Strings(eSorted)
        for i := range gSorted {
            if gSorted[i] != eSorted[i] {
                return false
            }
        }
    }
    return true
}

func main() {
    ${testCalls}

    output, _ := json.Marshal(map[string]interface{}{
        "success": true,
        "results": results,
    })
    fmt.Printf("__PISTON_JSON_START__%s__PISTON_JSON_END__\\n", string(output))
}
`;
}

/**
 * Executes code using browser sandbox or Piston API engine for 6 languages.
 */
export async function executeCode(
  userCode: string,
  language: SupportedLanguage,
  question: Question
): Promise<ExecutionResponse> {
  // If JS, run locally in browser with 0ms latency
  if (language === 'javascript') {
    try {
      return await runJavaScriptLocally(userCode, question);
    } catch (e: any) {
      console.warn('Local JS runner caught error:', e);
    }
  }

  // If TypeScript, try local transpiled run first, fallback to Piston
  if (language === 'typescript') {
    try {
      const stripped = stripTypeScript(userCode);
      return await runJavaScriptLocally(stripped, question);
    } catch (e) {
      console.warn('Local TS execution fallback to Piston:', e);
    }
  }

  // Setup Piston API execution parameters
  let pistonLang = 'python';
  let pistonVersion = '3.10.0';
  let fileName = 'solution.py';
  let harness = '';

  switch (language) {
    case 'typescript':
      pistonLang = 'typescript';
      pistonVersion = '5.0.3';
      fileName = 'solution.ts';
      harness = buildTypeScriptTestHarness(userCode, question);
      break;
    case 'python':
      pistonLang = 'python';
      pistonVersion = '3.10.0';
      fileName = 'solution.py';
      harness = buildPythonTestHarness(userCode, question);
      break;
    case 'cpp':
      pistonLang = 'c++';
      pistonVersion = '10.2.0';
      fileName = 'solution.cpp';
      harness = buildCppTestHarness(userCode, question);
      break;
    case 'java':
      pistonLang = 'java';
      pistonVersion = '15.0.2';
      fileName = 'Main.java';
      harness = buildJavaTestHarness(userCode, question);
      break;
    case 'go':
      pistonLang = 'go';
      pistonVersion = '1.16.2';
      fileName = 'main.go';
      harness = buildGoTestHarness(userCode, question);
      break;
    default:
      pistonLang = 'python';
      pistonVersion = '3.10.0';
      fileName = 'solution.py';
      harness = buildPythonTestHarness(userCode, question);
      break;
  }

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLang,
        version: pistonVersion,
        files: [
          {
            name: fileName,
            content: harness,
          },
        ],
        run_timeout: 5000,
        compile_timeout: 6000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API returned status ${response.status}`);
    }

    const data = await response.json();
    const compileOutput: string = data.compile?.output || data.compile?.stderr || '';
    const runOutput: string = data.run?.output || data.run?.stderr || '';

    // Check for compilation failure in compiled languages (C++, Java, Go)
    if (data.compile && data.compile.code !== 0 && data.compile.code !== null) {
      return {
        success: false,
        results: [],
        allPassed: false,
        passCount: 0,
        totalCount: question.testCases.length,
        compilerError: compileOutput || 'Compilation failed. Please check syntax and types.',
      };
    }

    // Check for runtime errors
    if (data.run?.stderr && !runOutput.includes('__PISTON_JSON_START__')) {
      return {
        success: false,
        results: [],
        allPassed: false,
        passCount: 0,
        totalCount: question.testCases.length,
        compilerError: data.run.stderr,
      };
    }

    if (runOutput.includes('__PISTON_JSON_START__')) {
      const match = runOutput.match(/__PISTON_JSON_START__([\s\S]*?)__PISTON_JSON_END__/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        const results: TestResult[] = parsed.results || [];
        const passCount = results.filter((r) => r.passed).length;
        return {
          success: true,
          results,
          allPassed: passCount === results.length,
          passCount,
          totalCount: results.length,
        };
      }
    }

    // Check if plain JSON error was output
    try {
      const parsed = JSON.parse(runOutput.trim());
      if (parsed.compilerError) {
        return {
          success: false,
          results: [],
          allPassed: false,
          passCount: 0,
          totalCount: question.testCases.length,
          compilerError: parsed.compilerError,
        };
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      results: [],
      allPassed: false,
      passCount: 0,
      totalCount: question.testCases.length,
      runtimeError: runOutput || `Execution failed for ${language}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      results: [],
      allPassed: false,
      passCount: 0,
      totalCount: question.testCases.length,
      runtimeError: `Execution error: ${err.message || 'Unable to connect to execution engine'}.`,
    };
  }
}
