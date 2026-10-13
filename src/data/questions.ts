import { DSA_EXTRA_QUESTIONS } from "./questions/dsaExtra";
import { Question } from '../types/interview';
import { SYSTEM_DESIGN_QUESTIONS } from './questions/systemDesign';
import { ML_AI_QUESTIONS } from './questions/mlAi';
import { DATA_SQL_QUESTIONS } from './questions/dataSql';
import { DEVOPS_SECURITY_QUESTIONS } from './questions/devopsSecurity';

const BASE_QUESTIONS_BANK: Question[] = [
  // ==================== DSA TRACK ====================
  {
    id: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hash Maps',
    trackId: 'dsa',
    timeEstimateMinutes: 15,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0, 1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    functionName: 'twoSum',
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  
}
`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  
}
`,
      python: `from typing import List

def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your solution here
    pass
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[]{};
    }
}
`,
      go: `package main

func twoSum(nums []int, target int) []int {
    // Write your solution here
    
    return []int{}
}
`,
    },
    testCases: [
      {
        id: 'ts-1',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        rawInput: [[2, 7, 11, 15], 9],
        rawExpected: [0, 1],
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
      },
      {
        id: 'ts-2',
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        rawInput: [[3, 2, 4], 6],
        rawExpected: [1, 2],
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6',
      },
      {
        id: 'ts-3',
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]',
        rawInput: [[3, 3], 6],
        rawExpected: [0, 1],
      },
      {
        id: 'ts-4',
        input: 'nums = [-1, -2, -3, -4, -5], target = -8',
        expectedOutput: '[2, 4]',
        rawInput: [[-1, -2, -3, -4, -5], -8],
        rawExpected: [2, 4],
        isHidden: true,
      },
    ],
  },
  {
    id: 'valid-palindrome',
    title: '2. Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers & Strings',
    trackId: 'dsa',
    timeEstimateMinutes: 15,
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a **palindrome***, or \`false\` *otherwise*.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters.',
      },
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.',
    ],
    functionName: 'isPalindrome',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your solution here
  
}
`,
      typescript: `function isPalindrome(s: string): boolean {
  // Write your solution here
  
}
`,
      python: `def isPalindrome(s: str) -> bool:
    # Write your solution here
    pass
`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your solution here
        
    }
};
`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
}
`,
      go: `package main

func isPalindrome(s string) bool {
    // Write your solution here
    
    return false
}
`,
    },
    testCases: [
      {
        id: 'vp-1',
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        rawInput: ['A man, a plan, a canal: Panama'],
        rawExpected: true,
      },
      {
        id: 'vp-2',
        input: 's = "race a car"',
        expectedOutput: 'false',
        rawInput: ['race a car'],
        rawExpected: false,
      },
      {
        id: 'vp-3',
        input: 's = " "',
        expectedOutput: 'true',
        rawInput: [' '],
        rawExpected: true,
      },
      {
        id: 'vp-4',
        input: 's = "0P"',
        expectedOutput: 'false',
        rawInput: ['0P'],
        rawExpected: false,
        isHidden: true,
      },
    ],
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window & Hash Set',
    trackId: 'dsa',
    timeEstimateMinutes: 20,
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

A **substring** is a contiguous non-empty sequence of characters within a string.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    functionName: 'lengthOfLongestSubstring',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}
`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your solution here
  
}
`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass
`,
      cpp: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        
        return 0;
    }
}
`,
      go: `package main

func lengthOfLongestSubstring(s string) int {
    // Write your solution here
    
    return 0
}
`,
    },
    testCases: [
      {
        id: 'lswrc-1',
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        rawInput: ['abcabcbb'],
        rawExpected: 3,
      },
      {
        id: 'lswrc-2',
        input: 's = "bbbbb"',
        expectedOutput: '1',
        rawInput: ['bbbbb'],
        rawExpected: 1,
      },
      {
        id: 'lswrc-3',
        input: 's = "pwwkew"',
        expectedOutput: '3',
        rawInput: ['pwwkew'],
        rawExpected: 3,
      },
      {
        id: 'lswrc-4',
        input: 's = ""',
        expectedOutput: '0',
        rawInput: [''],
        rawExpected: 0,
        isHidden: true,
      },
    ],
  },
  {
    id: 'merge-intervals',
    title: '4. Merge Intervals',
    difficulty: 'Medium',
    category: 'Arrays & Sorting',
    trackId: 'dsa',
    timeEstimateMinutes: 20,
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4',
    ],
    functionName: 'merge',
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // Write your solution here
  
}
`,
      typescript: `function merge(intervals: number[][]): number[][] {
  // Write your solution here
  
}
`,
      python: `from typing import List

def merge(intervals: List[List[int]]) -> List[List[int]]:
    # Write your solution here
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your solution here
        
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
        
        return new int[][]{};
    }
}
`,
      go: `package main

func merge(intervals [][]int) [][]int {
    // Write your solution here
    
    return [][]int{}
}
`,
    },
    testCases: [
      {
        id: 'mi-1',
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
        rawInput: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        rawExpected: [[1, 6], [8, 10], [15, 18]],
      },
      {
        id: 'mi-2',
        input: 'intervals = [[1,4],[4,5]]',
        expectedOutput: '[[1,5]]',
        rawInput: [[[1, 4], [4, 5]]],
        rawExpected: [[1, 5]],
      },
      {
        id: 'mi-3',
        input: 'intervals = [[1,4],[0,4]]',
        expectedOutput: '[[0,4]]',
        rawInput: [[[1, 4], [0, 4]]],
        rawExpected: [[0, 4]],
        isHidden: true,
      },
    ],
  },
  {
    id: 'group-anagrams',
    title: '5. Group Anagrams',
    difficulty: 'Medium',
    category: 'Hash Maps & Strings',
    trackId: 'dsa',
    timeEstimateMinutes: 20,
    description: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'Groups can be in any order, and elements within each group can be in any order.',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
    functionName: 'groupAnagrams',
    starterCode: {
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Write your solution here
  
}
`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Write your solution here
  
}
`,
      python: `from typing import List

def groupAnagrams(strs: List[str]) -> List[List[str]]:
    # Write your solution here
    pass
`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Write your solution here
        
    }
};
`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        
        return new ArrayList<>();
    }
}
`,
      go: `package main

func groupAnagrams(strs []string) [][]string {
    // Write your solution here
    
    return [][]string{}
}
`,
    },
    testCases: [
      {
        id: 'ga-1',
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        rawInput: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        rawExpected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']],
      },
      {
        id: 'ga-2',
        input: 'strs = [""]',
        expectedOutput: '[[""]]',
        rawInput: [['']],
        rawExpected: [['']],
      },
      {
        id: 'ga-3',
        input: 'strs = ["a"]',
        expectedOutput: '[["a"]]',
        rawInput: [['a']],
        rawExpected: [['a']],
      },
    ],
  },

  // ==================== FRONTEND TRACK ====================
  {
    id: 'custom-debounce',
    title: '1. Debounce Function with Immediate Flag',
    difficulty: 'Medium',
    category: 'JavaScript & Closures',
    trackId: 'frontend',
    timeEstimateMinutes: 20,
    description: `Implement a \`debounce\` function that delays invoking a callback function until after \`delayMs\` milliseconds have elapsed since the last time the debounced function was invoked.

Additionally, support an optional \`immediate\` boolean parameter:
- When \`immediate\` is \`true\`, trigger the callback on the leading edge (immediately on the first call), and ignore subsequent calls until \`delayMs\` of inactivity passes.
- When \`immediate\` is \`false\` or omitted, trigger the callback on the trailing edge after \`delayMs\` passes.

Your solution will be tested against sequential invocation series.`,
    examples: [
      {
        input: 'fn called at t=0ms, delay=50ms, immediate=false',
        output: 'Callback executed at t=50ms',
        explanation: 'Standard trailing debounce behavior.',
      },
      {
        input: 'fn called at t=0ms, delay=50ms, immediate=true',
        output: 'Callback executed at t=0ms',
        explanation: 'Leading edge immediate execution.',
      },
    ],
    constraints: [
      'delayMs >= 0',
      'Function must preserve `this` context and pass all provided arguments.',
    ],
    functionName: 'simulateDebounceCalls',
    starterCode: {
      javascript: `/**
 * @param {Function} fn
 * @param {number} delayMs
 * @param {boolean} [immediate=false]
 * @return {Function}
 */
function debounce(fn, delayMs, immediate = false) {
  let timer = null;
  return function(...args) {
    // Write your debounce implementation here
    
  };
}

// Test harness runner
function simulateDebounceCalls(callTimestamps, delayMs, immediate = false) {
  let callCount = 0;
  const target = () => { callCount++; };
  const debounced = debounce(target, delayMs, immediate);
  
  // Simulated clock
  let timerTriggerTime = null;
  let hasCalledImmediate = false;
  
  for (let i = 0; i < callTimestamps.length; i++) {
    const t = callTimestamps[i];
    if (immediate) {
      if (timerTriggerTime === null || t >= timerTriggerTime) {
        callCount++;
      }
      timerTriggerTime = t + delayMs;
    } else {
      timerTriggerTime = t + delayMs;
    }
  }
  if (!immediate && timerTriggerTime !== null) {
    callCount++;
  }
  return callCount;
}
`,
      typescript: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: any = null;
  return function(this: any, ...args: any[]) {
    // Write debounce here
  };
}

function simulateDebounceCalls(callTimestamps: number[], delayMs: number, immediate: boolean = false): number {
  let callCount = 0;
  let timerTriggerTime: number | null = null;
  
  for (let i = 0; i < callTimestamps.length; i++) {
    const t = callTimestamps[i];
    if (immediate) {
      if (timerTriggerTime === null || t >= timerTriggerTime) {
        callCount++;
      }
      timerTriggerTime = t + delayMs;
    } else {
      timerTriggerTime = t + delayMs;
    }
  }
  if (!immediate && timerTriggerTime !== null) {
    callCount++;
  }
  return callCount;
}
`,
      python: `from typing import List, Callable, Any
import time

def simulateDebounceCalls(callTimestamps: List[int], delayMs: int, immediate: bool = False) -> int:
    call_count = 0
    timer_trigger = None
    
    for t in callTimestamps:
        if immediate:
            if timer_trigger is None or t >= timer_trigger:
                call_count += 1
            timer_trigger = t + delayMs
        else:
            timer_trigger = t + delayMs
            
    if not immediate and timer_trigger is not None:
        call_count += 1
    return call_count
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int simulateDebounceCalls(vector<int>& callTimestamps, int delayMs, bool immediate = false) {
        int callCount = 0;
        int timerTrigger = -1;
        for (int t : callTimestamps) {
            if (immediate) {
                if (timerTrigger == -1 || t >= timerTrigger) {
                    callCount++;
                }
                timerTrigger = t + delayMs;
            } else {
                timerTrigger = t + delayMs;
            }
        }
        if (!immediate && timerTrigger != -1) {
            callCount++;
        }
        return callCount;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int simulateDebounceCalls(int[] callTimestamps, int delayMs, boolean immediate) {
        int callCount = 0;
        int timerTrigger = -1;
        for (int t : callTimestamps) {
            if (immediate) {
                if (timerTrigger == -1 || t >= timerTrigger) {
                    callCount++;
                }
                timerTrigger = t + delayMs;
            } else {
                timerTrigger = t + delayMs;
            }
        }
        if (!immediate && timerTrigger != -1) {
            callCount++;
        }
        return callCount;
    }
}
`,
      go: `package main

func simulateDebounceCalls(callTimestamps []int, delayMs int, immediate bool) int {
    callCount := 0
    timerTrigger := -1
    for _, t := range callTimestamps {
        if immediate {
            if timerTrigger == -1 || t >= timerTrigger {
                callCount++
            }
            timerTrigger = t + delayMs
        } else {
            timerTrigger = t + delayMs
        }
    }
    if !immediate && timerTrigger != -1 {
        callCount++
    }
    return callCount
}
`,
    },
    testCases: [
      {
        id: 'db-1',
        input: 'callTimestamps = [0, 20, 40], delayMs = 50, immediate = false',
        expectedOutput: '1',
        rawInput: [[0, 20, 40], 50, false],
        rawExpected: 1,
        explanation: '3 calls in rapid succession collapse into 1 execution at t=90ms.',
      },
      {
        id: 'db-2',
        input: 'callTimestamps = [0, 20, 40], delayMs = 50, immediate = true',
        expectedOutput: '1',
        rawInput: [[0, 20, 40], 50, true],
        rawExpected: 1,
        explanation: 'Immediate call fires at t=0ms. Rapid subsequent calls are throttled.',
      },
      {
        id: 'db-3',
        input: 'callTimestamps = [0, 100, 200], delayMs = 50, immediate = false',
        expectedOutput: '3',
        rawInput: [[0, 100, 200], 50, false],
        rawExpected: 3,
        explanation: 'Interval between calls exceeds delay, so 3 separate executions happen.',
      },
    ],
  },
  {
    id: 'deep-clone-object',
    title: '2. Deep Clone Object',
    difficulty: 'Medium',
    category: 'Objects & Data Structures',
    trackId: 'frontend',
    timeEstimateMinutes: 20,
    description: `Implement a function \`deepClone(value)\` that creates a deep copy of any passed JavaScript value without modifying the original.

Requirements:
- Primitive values (numbers, strings, booleans, null, undefined) must return as-is.
- Arrays and Objects must be deeply copied (including nested children).
- Do not use \`JSON.parse(JSON.stringify(x))\` or \`structuredClone\` in standard production interviews without understanding recursive cloning mechanics.`,
    examples: [
      {
        input: 'value = { a: 1, b: { c: 2, d: [3, 4] } }',
        output: '{ a: 1, b: { c: 2, d: [3, 4] } }',
        explanation: 'Nested object and array cloned into independent memory references.',
      },
    ],
    constraints: [
      'Input contains serializable structures (Objects, Arrays, Primitives).',
    ],
    functionName: 'deepClone',
    starterCode: {
      javascript: `/**
 * @param {*} value
 * @return {*}
 */
function deepClone(value) {
  // Write your recursive deepClone implementation here
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }
  
  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = deepClone(value[key]);
  }
  return copy;
}
`,
      typescript: `function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as unknown as T;
  }
  
  const copy: any = {};
  for (const key of Object.keys(value as any)) {
    copy[key] = deepClone((value as any)[key]);
  }
  return copy;
}
`,
      python: `import copy
from typing import Any

def deepClone(value: Any) -> Any:
    # Write your solution here
    if value is None or not isinstance(value, (dict, list)):
        return value
    if isinstance(value, list):
        return [deepClone(x) for x in value]
    return {k: deepClone(v) for k, v in value.items()}
`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string deepClone(string jsonStr) {
        return jsonStr;
    }
};
`,
      java: `class Solution {
    public Object deepClone(Object value) {
        return value;
    }
}
`,
      go: `package main

func deepClone(value interface{}) interface{} {
    return value
}
`,
    },
    testCases: [
      {
        id: 'dc-1',
        input: 'value = { a: 1, b: { c: 2 } }',
        expectedOutput: '{"a":1,"b":{"c":2}}',
        rawInput: [{ a: 1, b: { c: 2 } }],
        rawExpected: { a: 1, b: { c: 2 } },
      },
      {
        id: 'dc-2',
        input: 'value = [1, [2, 3], { x: "hello" }]',
        expectedOutput: '[1,[2,3],{"x":"hello"}]',
        rawInput: [[1, [2, 3], { x: 'hello' }]],
        rawExpected: [1, [2, 3], { x: 'hello' }],
      },
      {
        id: 'dc-3',
        input: 'value = "primitive string"',
        expectedOutput: '"primitive string"',
        rawInput: ['primitive string'],
        rawExpected: 'primitive string',
      },
    ],
  },
  {
    id: 'event-emitter',
    title: '3. Event Emitter Pattern',
    difficulty: 'Medium',
    category: 'Design Patterns & UI Architecture',
    trackId: 'frontend',
    timeEstimateMinutes: 20,
    description: `Design an \`EventEmitter\` class that allows components to subscribe to and trigger custom named events.

Methods to implement:
- \`subscribe(eventName, callback)\`: Registers callback for event. Returns an unsubscribe function or subscription object with an \`unsubscribe()\` method.
- \`emit(eventName, args)\`: Invokes all registered callbacks for the event in registration order with provided args. Returns an array containing the return values of all called handlers.`,
    examples: [
      {
        input: 'emitter.subscribe("click", (x) => x * 2); emitter.emit("click", [5])',
        output: '[10]',
        explanation: 'Handler triggered with argument 5, returning 10.',
      },
    ],
    constraints: [
      'Multiple callbacks can be registered for the same event.',
      'Unsubscribing must safely remove the handler without affecting other subscriptions.',
    ],
    functionName: 'runEventEmitterHarness',
    starterCode: {
      javascript: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    const listeners = this.events.get(eventName);
    listeners.push(callback);

    return {
      unsubscribe: () => {
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  emit(eventName, args = []) {
    if (!this.events.has(eventName)) {
      return [];
    }
    return this.events.get(eventName).map(cb => cb(...args));
  }
}

// Test harness
function runEventEmitterHarness(actions) {
  const emitter = new EventEmitter();
  const subs = [];
  const results = [];

  for (const act of actions) {
    if (act.type === 'subscribe') {
      const sub = emitter.subscribe(act.event, (...args) => act.returnVal !== undefined ? act.returnVal : args[0]);
      subs.push(sub);
      results.push('subscribed');
    } else if (act.type === 'emit') {
      const out = emitter.emit(act.event, act.args || []);
      results.push(out);
    } else if (act.type === 'unsubscribe') {
      if (subs[act.index]) {
        subs[act.index].unsubscribe();
        results.push('unsubscribed');
      }
    }
  }
  return results;
}
`,
      typescript: `class EventEmitter {
  private events = new Map<string, Function[]>();

  subscribe(eventName: string, callback: Function) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    const listeners = this.events.get(eventName)!;
    listeners.push(callback);

    return {
      unsubscribe: () => {
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  emit(eventName: string, args: any[] = []): any[] {
    if (!this.events.has(eventName)) {
      return [];
    }
    return this.events.get(eventName)!.map(cb => cb(...args));
  }
}

function runEventEmitterHarness(actions: any[]): any[] {
  const emitter = new EventEmitter();
  const subs: any[] = [];
  const results: any[] = [];

  for (const act of actions) {
    if (act.type === 'subscribe') {
      const sub = emitter.subscribe(act.event, (...args: any[]) => act.returnVal !== undefined ? act.returnVal : args[0]);
      subs.push(sub);
      results.push('subscribed');
    } else if (act.type === 'emit') {
      results.push(emitter.emit(act.event, act.args || []));
    } else if (act.type === 'unsubscribe') {
      if (subs[act.index]) {
        subs[act.index].unsubscribe();
        results.push('unsubscribed');
      }
    }
  }
  return results;
}
`,
      python: `from typing import List, Dict, Any, Callable

class EventEmitter:
    def __init__(self):
        self.events: Dict[str, List[Callable]] = {}

    def subscribe(self, event_name: str, callback: Callable):
        if event_name not in self.events:
            self.events[event_name] = []
        self.events[event_name].append(callback)
        
        def unsubscribe():
            if callback in self.events.get(event_name, []):
                self.events[event_name].remove(callback)
        return unsubscribe

    def emit(self, event_name: str, args: List[Any] = None) -> List[Any]:
        if args is None:
            args = []
        if event_name not in self.events:
            return []
        return [cb(*args) for cb in self.events[event_name]]

def runEventEmitterHarness(actions: List[Dict[str, Any]]) -> List[Any]:
    emitter = EventEmitter()
    subs = []
    results = []
    for act in actions:
        if act['type'] == 'subscribe':
            cb = (lambda val: lambda *args: val)(act.get('returnVal', 1))
            subs.append(emitter.subscribe(act['event'], cb))
            results.append('subscribed')
        elif act['type'] == 'emit':
            results.append(emitter.emit(act['event'], act.get('args', [])))
        elif act['type'] == 'unsubscribe':
            subs[act['index']]()
            results.append('unsubscribed')
    return results
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> runEventEmitterHarness(vector<string>& actions) {
        return actions;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public List<Object> runEventEmitterHarness(List<Map<String, Object>> actions) {
        return new ArrayList<>();
    }
}
`,
      go: `package main

func runEventEmitterHarness(actions []interface{}) []interface{} {
    return actions
}
`,
    },
    testCases: [
      {
        id: 'ee-1',
        input: 'subscribe "onClick", emit "onClick" with [42]',
        expectedOutput: '["subscribed", [42]]',
        rawInput: [
          [
            { type: 'subscribe', event: 'onClick', returnVal: 42 },
            { type: 'emit', event: 'onClick', args: [42] },
          ],
        ],
        rawExpected: ['subscribed', [42]],
      },
      {
        id: 'ee-2',
        input: 'subscribe 2 handlers, emit, unsubscribe first, emit again',
        expectedOutput: '["subscribed", "subscribed", [10, 20], "unsubscribed", [20]]',
        rawInput: [
          [
            { type: 'subscribe', event: 'tick', returnVal: 10 },
            { type: 'subscribe', event: 'tick', returnVal: 20 },
            { type: 'emit', event: 'tick', args: [] },
            { type: 'unsubscribe', index: 0 },
            { type: 'emit', event: 'tick', args: [] },
          ],
        ],
        rawExpected: ['subscribed', 'subscribed', [10, 20], 'unsubscribed', [20]],
      },
    ],
  },
  {
    id: 'flatten-nested-array',
    title: '4. Flatten Nested Array with Depth Limit',
    difficulty: 'Medium',
    category: 'Recursion & Arrays',
    trackId: 'frontend',
    timeEstimateMinutes: 15,
    description: `Given a multi-dimensional array \`arr\` and a depth \`n\`, return a **flattened** version of that array.

A flattened array is a version of that array with some or all of the sub-arrays removed and replaced with the actual elements in that sub-array. This flattening operation should only be done up to the specified depth \`n\`. The depth of the elements in the first array are considered 0.`,
    examples: [
      {
        input: 'arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]], n = 1',
        output: '[1, 2, 3, 4, 5, 6, 7, 8, [9, 10, 11], 12, 13, 14, 15]',
        explanation: 'All subarrays at depth 1 are flattened, but [9, 10, 11] at depth 2 remains intact.',
      },
    ],
    constraints: [
      '0 <= count of numbers in arr <= 10^5',
      '0 <= depth of any subarray <= 1000',
      '0 <= n <= 1000',
    ],
    functionName: 'flat',
    starterCode: {
      javascript: `/**
 * @param {any[]} arr
 * @param {number} n
 * @return {any[]}
 */
function flat(arr, n) {
  // Write your solution here
  if (n <= 0) return arr.slice();
  
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && n > 0) {
      result.push(...flat(item, n - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}
`,
      typescript: `function flat(arr: any[], n: number): any[] {
  if (n <= 0) return arr.slice();
  
  const result: any[] = [];
  for (const item of arr) {
    if (Array.isArray(item) && n > 0) {
      result.push(...flat(item, n - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}
`,
      python: `from typing import List, Any

def flat(arr: List[Any], n: int) -> List[Any]:
    if n <= 0:
        return arr[:]
    res = []
    for item in arr:
        if isinstance(item, list) and n > 0:
            res.extend(flat(item, n - 1))
        else:
            res.append(item)
    return res
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    // C++ simplified harness
};
`,
      java: `import java.util.*;

class Solution {
    public List<Object> flat(List<Object> arr, int n) {
        return arr;
    }
}
`,
      go: `package main

func flat(arr []interface{}, n int) []interface{} {
    return arr
}
`,
    },
    testCases: [
      {
        id: 'fl-1',
        input: 'arr = [1, [2, [3]]], n = 1',
        expectedOutput: '[1, 2, [3]]',
        rawInput: [[1, [2, [3]]], 1],
        rawExpected: [1, 2, [3]],
      },
      {
        id: 'fl-2',
        input: 'arr = [1, [2, [3, [4]]]], n = 2',
        expectedOutput: '[1, 2, 3, [4]]',
        rawInput: [[1, [2, [3, [4]]]], 2],
        rawExpected: [1, 2, 3, [4]],
      },
      {
        id: 'fl-3',
        input: 'arr = [[1, 2], [3, 4]], n = 0',
        expectedOutput: '[[1, 2], [3, 4]]',
        rawInput: [[[1, 2], [3, 4]], 0],
        rawExpected: [[1, 2], [3, 4]],
      },
    ],
  },

  // ==================== BACKEND TRACK ====================
  {
    id: 'lru-cache',
    title: '1. LRU Cache Implementation',
    difficulty: 'Medium',
    category: 'Data Structures & Caching',
    trackId: 'backend',
    timeEstimateMinutes: 25,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\`: Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'LRUCache with capacity 2 evicts key 2, then key 1.',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    functionName: 'runLRUCacheHarness',
    starterCode: {
      javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first inserted in JS Map iterator)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// Test harness
function runLRUCacheHarness(operations, values) {
  let cache = null;
  const results = [];
  
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const val = values[i];
    if (op === 'LRUCache') {
      cache = new LRUCache(val[0]);
      results.push(null);
    } else if (op === 'put') {
      cache.put(val[0], val[1]);
      results.push(null);
    } else if (op === 'get') {
      results.push(cache.get(val[0]));
    }
  }
  return results;
}
`,
      typescript: `class LRUCache {
  private capacity: number;
  private cache = new Map<number, number>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

function runLRUCacheHarness(operations: string[], values: number[][]): (number | null)[] {
  let cache: LRUCache | null = null;
  const results: (number | null)[] = [];
  
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const val = values[i];
    if (op === 'LRUCache') {
      cache = new LRUCache(val[0]);
      results.push(null);
    } else if (op === 'put') {
      cache!.put(val[0], val[1]);
      results.push(null);
    } else if (op === 'get') {
      results.push(cache!.get(val[0]));
    }
  }
  return results;
}
`,
      python: `from collections import OrderedDict
from typing import List, Any

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

def runLRUCacheHarness(operations: List[str], values: List[List[int]]) -> List[Any]:
    cache = None
    results = []
    for op, val in zip(operations, values):
        if op == "LRUCache":
            cache = LRUCache(val[0])
            results.append(None)
        elif op == "put":
            cache.put(val[0], val[1])
            results.append(None)
        elif op == "get":
            results.append(cache.get(val[0]))
    return results
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    // C++ runner
};
`,
      java: `import java.util.*;

class Solution {
    // Java runner
}
`,
      go: `package main

func runLRUCacheHarness(operations []string, values [][]int) []interface{} {
    return nil
}
`,
    },
    testCases: [
      {
        id: 'lru-1',
        input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)',
        expectedOutput: '[null, null, null, 1, null, -1]',
        rawInput: [
          ['LRUCache', 'put', 'put', 'get', 'put', 'get'],
          [[2], [1, 1], [2, 2], [1], [3, 3], [2]],
        ],
        rawExpected: [null, null, null, 1, null, -1],
      },
      {
        id: 'lru-2',
        input: 'LRUCache(1), put(2,1), get(2), put(3,2), get(2), get(3)',
        expectedOutput: '[null, null, 1, null, -1, 2]',
        rawInput: [
          ['LRUCache', 'put', 'get', 'put', 'get', 'get'],
          [[1], [2, 1], [2], [3, 2], [2], [3]],
        ],
        rawExpected: [null, null, 1, null, -1, 2],
      },
    ],
  },
  {
    id: 'sliding-window-rate-limiter',
    title: '2. Sliding Window Rate Limiter',
    difficulty: 'Medium',
    category: 'System Design & Algorithms',
    trackId: 'backend',
    timeEstimateMinutes: 20,
    description: `Implement a \`RateLimiter\` that regulates API requests based on a sliding window algorithm.

A user is allowed at most \`maxRequests\` within any \`windowSeconds\` timeframe.

Implement the method:
- \`allowRequest(userId, timestampSeconds)\`: Returns \`true\` if the request is permitted at \`timestampSeconds\`, or \`false\` if it should be rate-limited/rejected.`,
    examples: [
      {
        input: 'maxRequests = 3, windowSeconds = 10, requests at t = [1, 2, 3, 4, 12]',
        output: '[true, true, true, false, true]',
        explanation: 'The 4th request at t=4 is blocked (3 requests already inside [0, 10s]). At t=12, the request at t=1 has fallen out of the window [2s..12s], so it is allowed.',
      },
    ],
    constraints: [
      'Timestamps for each user arrive in monotonically non-decreasing order.',
      'Memory per user should only store active timestamps within the current sliding window.',
    ],
    functionName: 'simulateRateLimiter',
    starterCode: {
      javascript: `class RateLimiter {
  constructor(maxRequests, windowSeconds) {
    this.maxRequests = maxRequests;
    this.windowSeconds = windowSeconds;
    this.userRequests = new Map();
  }

  allowRequest(userId, timestamp) {
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }
    const timestamps = this.userRequests.get(userId);
    const windowStart = timestamp - this.windowSeconds;
    
    // Purge expired timestamps
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }
    
    if (timestamps.length < this.maxRequests) {
      timestamps.push(timestamp);
      return true;
    }
    return false;
  }
}

function simulateRateLimiter(maxRequests, windowSeconds, requests) {
  const limiter = new RateLimiter(maxRequests, windowSeconds);
  return requests.map(([userId, t]) => limiter.allowRequest(userId, t));
}
`,
      typescript: `class RateLimiter {
  private maxRequests: number;
  private windowSeconds: number;
  private userRequests = new Map<string, number[]>();

  constructor(maxRequests: number, windowSeconds: number) {
    this.maxRequests = maxRequests;
    this.windowSeconds = windowSeconds;
  }

  allowRequest(userId: string, timestamp: number): boolean {
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }
    const timestamps = this.userRequests.get(userId)!;
    const windowStart = timestamp - this.windowSeconds;
    
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }
    
    if (timestamps.length < this.maxRequests) {
      timestamps.push(timestamp);
      return true;
    }
    return false;
  }
}

function simulateRateLimiter(maxRequests: number, windowSeconds: number, requests: [string, number][]): boolean[] {
  const limiter = new RateLimiter(maxRequests, windowSeconds);
  return requests.map(([userId, t]) => limiter.allowRequest(userId, t));
}
`,
      python: `from typing import List, Tuple, Dict
from collections import deque

class RateLimiter:
    def __init__(self, maxRequests: int, windowSeconds: int):
        self.max_requests = maxRequests
        self.window_seconds = windowSeconds
        self.user_requests: Dict[str, deque] = {}

    def allow_request(self, user_id: str, timestamp: int) -> bool:
        if user_id not in self.user_requests:
            self.user_requests[user_id] = deque()
        timestamps = self.user_requests[user_id]
        window_start = timestamp - self.window_seconds
        
        while timestamps and timestamps[0] <= window_start:
            timestamps.popleft()
            
        if len(timestamps) < self.max_requests:
            timestamps.append(timestamp)
            return True
        return False

def simulateRateLimiter(maxRequests: int, windowSeconds: int, requests: List[List[Any]]) -> List[bool]:
    limiter = RateLimiter(maxRequests, windowSeconds)
    return [limiter.allow_request(u, t) for u, t in requests]
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    // C++
};
`,
      java: `import java.util.*;

class Solution {
    // Java
}
`,
      go: `package main

func simulateRateLimiter(maxRequests int, windowSeconds int, requests [][]interface{}) []bool {
    return nil
}
`,
    },
    testCases: [
      {
        id: 'rl-1',
        input: 'maxRequests = 3, windowSeconds = 10, requests = [["u1", 1], ["u1", 2], ["u1", 3], ["u1", 4], ["u1", 12]]',
        expectedOutput: '[true, true, true, false, true]',
        rawInput: [
          3,
          10,
          [
            ['u1', 1],
            ['u1', 2],
            ['u1', 3],
            ['u1', 4],
            ['u1', 12],
          ],
        ],
        rawExpected: [true, true, true, false, true],
      },
      {
        id: 'rl-2',
        input: 'Two distinct users: u1 and u2 within limit',
        expectedOutput: '[true, true, true, true]',
        rawInput: [
          2,
          5,
          [
            ['u1', 1],
            ['u2', 1],
            ['u1', 2],
            ['u2', 2],
          ],
        ],
        rawExpected: [true, true, true, true],
      },
    ],
  },
  {
    id: 'query-string-parser',
    title: '3. Query String Parser & Serializer',
    difficulty: 'Medium',
    category: 'Strings & Parsing',
    trackId: 'backend',
    timeEstimateMinutes: 20,
    description: `Write a function \`parseQuery(queryString)\` that parses a URL query string into a structured JavaScript key-value object.

Requirements:
- Decode URI components (e.g. \`%20\` -> space).
- If a key appears multiple times (e.g. \`tag=js&tag=react\`), combine the values into an array \`["js", "react"]\`.
- Handle boolean-like values: if a key has no \`=\` sign (e.g. \`filter&sort=asc\`), its value should be \`true\`.`,
    examples: [
      {
        input: 'queryString = "name=Alex&role=engineer&tag=dsa&tag=faang&active"',
        output: '{"name": "Alex", "role": "engineer", "tag": ["dsa", "faang"], "active": true}',
      },
    ],
    constraints: [
      'Input is a valid query string with or without leading "?"',
    ],
    functionName: 'parseQuery',
    starterCode: {
      javascript: `/**
 * @param {string} queryString
 * @return {Object}
 */
function parseQuery(queryString) {
  const clean = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  if (!clean.trim()) return {};
  
  const result = {};
  const pairs = clean.split('&');
  
  for (const pair of pairs) {
    if (!pair) continue;
    const [rawKey, ...rest] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    const hasValue = rest.length > 0;
    const val = hasValue ? decodeURIComponent(rest.join('=')) : true;
    
    if (result.hasOwnProperty(key)) {
      if (Array.isArray(result[key])) {
        result[key].push(val);
      } else {
        result[key] = [result[key], val];
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}
`,
      typescript: `function parseQuery(queryString: string): Record<string, any> {
  const clean = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  if (!clean.trim()) return {};
  
  const result: Record<string, any> = {};
  const pairs = clean.split('&');
  
  for (const pair of pairs) {
    if (!pair) continue;
    const [rawKey, ...rest] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    const hasValue = rest.length > 0;
    const val = hasValue ? decodeURIComponent(rest.join('=')) : true;
    
    if (result.hasOwnProperty(key)) {
      if (Array.isArray(result[key])) {
        result[key].push(val);
      } else {
        result[key] = [result[key], val];
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}
`,
      python: `from urllib.parse import unquote
from typing import Dict, Any

def parseQuery(queryString: str) -> Dict[str, Any]:
    clean = queryString[1:] if queryString.startswith('?') else queryString
    if not clean.strip():
        return {}
    res = {}
    for pair in clean.split('&'):
        if not pair:
            continue
        parts = pair.split('=', 1)
        k = unquote(parts[0])
        val = unquote(parts[1]) if len(parts) > 1 else True
        if k in res:
            if isinstance(res[k], list):
                res[k].append(val)
            else:
                res[k] = [res[k], val]
        else:
            res[k] = val
    return res
`,
      cpp: `#include <string>
using namespace std;

class Solution {
    // C++
};
`,
      java: `import java.util.*;

class Solution {
    // Java
}
`,
      go: `package main

func parseQuery(queryString string) map[string]interface{} {
    return nil
}
`,
    },
    testCases: [
      {
        id: 'qp-1',
        input: 'queryString = "page=1&limit=20&sort=asc"',
        expectedOutput: '{"page":"1","limit":"20","sort":"asc"}',
        rawInput: ['page=1&limit=20&sort=asc'],
        rawExpected: { page: '1', limit: '20', sort: 'asc' },
      },
      {
        id: 'qp-2',
        input: 'queryString = "?tag=react&tag=node&active"',
        expectedOutput: '{"tag":["react","node"],"active":true}',
        rawInput: ['?tag=react&tag=node&active'],
        rawExpected: { tag: ['react', 'node'], active: true },
      },
    ],
  },

  // ==================== FULL STACK TRACK ====================
  {
    id: 'version-comparator',
    title: '1. Compare Version Numbers',
    difficulty: 'Medium',
    category: 'Full Stack & Versioning',
    trackId: 'fullstack',
    timeEstimateMinutes: 15,
    description: `Given two version strings, \`version1\` and \`version2\`, compare them. A version string consists of revisions separated by dots \`.\`. The value of the revision is its **integer conversion** ignoring leading zeros.

Return:
- \`-1\` if \`version1 < version2\`
- \`1\` if \`version1 > version2\`
- \`0\` if \`version1 == version2\``,
    examples: [
      {
        input: 'version1 = "1.2", version2 = "1.10"',
        output: '-1',
        explanation: 'version1 has revision 2, version2 has revision 10. 2 < 10, so version1 < version2.',
      },
      {
        input: 'version1 = "1.01", version2 = "1.001"',
        output: '0',
        explanation: 'Ignoring leading zeroes, both "01" and "001" represent integer 1.',
      },
      {
        input: 'version1 = "1.0", version2 = "1.0.0.0"',
        output: '0',
      },
    ],
    constraints: [
      '1 <= version1.length, version2.length <= 500',
      'version1 and version2 only contain digits and \'.\'',
    ],
    functionName: 'compareVersion',
    starterCode: {
      javascript: `/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
function compareVersion(version1, version2) {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  const maxLen = Math.max(v1.length, v2.length);
  
  for (let i = 0; i < maxLen; i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}
`,
      typescript: `function compareVersion(version1: string, version2: string): number {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  const maxLen = Math.max(v1.length, v2.length);
  
  for (let i = 0; i < maxLen; i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}
`,
      python: `def compareVersion(version1: str, version2: str) -> int:
    v1 = [int(x) for x in version1.split('.')]
    v2 = [int(x) for x in version2.split('.')]
    max_len = max(len(v1), len(v2))
    for i in range(max_len):
        n1 = v1[i] if i < len(v1) else 0
        n2 = v2[i] if i < len(v2) else 0
        if n1 > n2:
            return 1
        if n1 < n2:
            return -1
    return 0
`,
      cpp: `#include <string>
#include <sstream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int compareVersion(string version1, string version2) {
        int i = 0, j = 0;
        int n1 = version1.size(), n2 = version2.size();
        while (i < n1 || j < n2) {
            long num1 = 0, num2 = 0;
            while (i < n1 && version1[i] != '.') {
                num1 = num1 * 10 + (version1[i++] - '0');
            }
            while (j < n2 && version2[j] != '.') {
                num2 = num2 * 10 + (version2[j++] - '0');
            }
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
            i++;
            j++;
        }
        return 0;
    }
};
`,
      java: `class Solution {
    public int compareVersion(String version1, String version2) {
        String[] v1 = version1.split("\\\\.");
        String[] v2 = version2.split("\\\\.");
        int maxLen = Math.max(v1.length, v2.length);
        for (int i = 0; i < maxLen; i++) {
            int n1 = i < v1.length ? Integer.parseInt(v1[i]) : 0;
            int n2 = i < v2.length ? Integer.parseInt(v2[i]) : 0;
            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
        }
        return 0;
    }
}
`,
      go: `package main

import (
    "strconv"
    "strings"
)

func compareVersion(version1 string, version2 string) int {
    v1 := strings.Split(version1, ".")
    v2 := strings.Split(version2, ".")
    maxLen := len(v1)
    if len(v2) > maxLen {
        maxLen = len(v2)
    }
    for i := 0; i < maxLen; i++ {
        n1, n2 := 0, 0
        if i < len(v1) {
            n1, _ = strconv.Atoi(v1[i])
        }
        if i < len(v2) {
            n2, _ = strconv.Atoi(v2[i])
        }
        if n1 > n2 {
            return 1
        }
        if n1 < n2 {
            return -1
        }
    }
    return 0
}
`,
    },
    testCases: [
      {
        id: 'cv-1',
        input: 'version1 = "1.2", version2 = "1.10"',
        expectedOutput: '-1',
        rawInput: ['1.2', '1.10'],
        rawExpected: -1,
      },
      {
        id: 'cv-2',
        input: 'version1 = "1.01", version2 = "1.001"',
        expectedOutput: '0',
        rawInput: ['1.01', '1.001'],
        rawExpected: 0,
      },
      {
        id: 'cv-3',
        input: 'version1 = "1.0", version2 = "1.0.0.0"',
        expectedOutput: '0',
        rawInput: ['1.0', '1.0.0.0'],
        rawExpected: 0,
      },
    ],
  },
  {
    id: 'spiral-matrix',
    title: '2. Spiral Matrix Traversal',
    difficulty: 'Medium',
    category: 'Matrix & Geometry',
    trackId: 'fullstack',
    timeEstimateMinutes: 20,
    description: `Given an \`m x n\` \`matrix\`, return *all elements of the* \`matrix\` *in spiral order*.`,
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
      },
      {
        input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
        output: '[1,2,3,4,8,12,11,10,9,5,6,7]',
      },
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 10',
      '-100 <= matrix[i][j] <= 100',
    ],
    functionName: 'spiralOrder',
    starterCode: {
      javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
  if (!matrix || matrix.length === 0) return [];
  const res = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    // Traverse Right
    for (let j = left; j <= right; j++) res.push(matrix[top][j]);
    top++;
    
    // Traverse Down
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
    right--;
    
    if (top <= bottom) {
      // Traverse Left
      for (let j = right; j >= left; j--) res.push(matrix[bottom][j]);
      bottom--;
    }
    
    if (left <= right) {
      // Traverse Up
      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
      left++;
    }
  }
  return res;
}
`,
      typescript: `function spiralOrder(matrix: number[][]): number[] {
  if (!matrix || matrix.length === 0) return [];
  const res: number[] = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) res.push(matrix[top][j]);
    top++;
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let j = right; j >= left; j--) res.push(matrix[bottom][j]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
      left++;
    }
  }
  return res;
}
`,
      python: `from typing import List

def spiralOrder(matrix: List[List[int]]) -> List[int]:
    if not matrix:
        return []
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            res.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1):
            res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1):
                res.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                res.append(matrix[i][left])
            left += 1
    return res
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        if (matrix.empty()) return res;
        int top = 0, bottom = matrix.size() - 1;
        int left = 0, right = matrix[0].size() - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res.push_back(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) res.push_back(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);
                left++;
            }
        }
        return res;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return res;
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) res.add(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
                left++;
            }
        }
        return res;
    }
}
`,
      go: `package main

func spiralOrder(matrix [][]int) []int {
    if len(matrix) == 0 {
        return []int{}
    }
    res := []int{}
    top, bottom := 0, len(matrix)-1
    left, right := 0, len(matrix[0])-1
    for top <= bottom && left <= right {
        for j := left; j <= right; j++ {
            res = append(res, matrix[top][j])
        }
        top++
        for i := top; i <= bottom; i++ {
            res = append(res, matrix[i][right])
        }
        right--
        if top <= bottom {
            for j := right; j >= left; j-- {
                res = append(res, matrix[bottom][j])
            }
            bottom--
        }
        if left <= right {
            for i := bottom; i >= top; i-- {
                res = append(res, matrix[i][left])
            }
            left++
        }
    }
    return res
}
`,
    },
    testCases: [
      {
        id: 'sm-1',
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        expectedOutput: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
        rawInput: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
        rawExpected: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      },
      {
        id: 'sm-2',
        input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
        expectedOutput: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]',
        rawInput: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
        rawExpected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
      },
    ],
  },
];

export const QUESTIONS_BANK: Question[] = [
  ...BASE_QUESTIONS_BANK,
  ...DSA_EXTRA_QUESTIONS,
  ...SYSTEM_DESIGN_QUESTIONS,
  ...ML_AI_QUESTIONS,
  ...DATA_SQL_QUESTIONS,
  ...DEVOPS_SECURITY_QUESTIONS,
];

