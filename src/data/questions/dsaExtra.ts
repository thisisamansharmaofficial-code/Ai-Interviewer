import { Question } from '../../types/interview';

export const DSA_EXTRA_QUESTIONS: Question[] = [
  {
    id: 'valid-parentheses',
    title: '6. Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks',
    trackId: 'dsa',
    timeEstimateMinutes: 15,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    functionName: 'isValid',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your solution here
  
}
`,
      typescript: `function isValid(s: string): boolean {
  // Write your solution here
  
}
`,
      python: `def isValid(s: str) -> bool:
    # Write your solution here
    pass
`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        
    }
};
`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        
        return false;
    }
}
`,
      go: `package main

func isValid(s string) bool {
    // Write your solution here
    
    return false
}
`,
    },
    testCases: [
      {
        id: 'vp-1',
        input: 's = "()"',
        expectedOutput: 'true',
        rawInput: ['()'],
        rawExpected: true,
      },
      {
        id: 'vp-2',
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        rawInput: ['()[]{}'],
        rawExpected: true,
      },
      {
        id: 'vp-3',
        input: 's = "(]"',
        expectedOutput: 'false',
        rawInput: ['(]'],
        rawExpected: false,
      },
      {
        id: 'vp-4',
        input: 's = "([)]"',
        expectedOutput: 'false',
        rawInput: ['([)]'],
        rawExpected: false,
      },
      {
        id: 'vp-5',
        input: 's = "{[]}"',
        expectedOutput: 'true',
        rawInput: ['{[]}'],
        rawExpected: true,
        isHidden: true,
      }
    ],
  },
  {
    id: 'container-with-most-water',
    title: '7. Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    trackId: 'dsa',
    timeEstimateMinutes: 20,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

Notice that you may not slant the container.`,
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.',
      },
      {
        input: 'height = [1,1]',
        output: '1',
      },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    functionName: 'maxArea',
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Write your solution here
  
}
`,
      typescript: `function maxArea(height: number[]): number {
  // Write your solution here
  
}
`,
      python: `from typing import List

def maxArea(height: List[int]) -> int:
    # Write your solution here
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your solution here
        
    }
};
`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
}
`,
      go: `package main

func maxArea(height []int) int {
    // Write your solution here
    
    return 0
}
`,
    },
    testCases: [
      {
        id: 'cwmw-1',
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        expectedOutput: '49',
        rawInput: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
        rawExpected: 49,
      },
      {
        id: 'cwmw-2',
        input: 'height = [1,1]',
        expectedOutput: '1',
        rawInput: [[1, 1]],
        rawExpected: 1,
      },
      {
        id: 'cwmw-3',
        input: 'height = [4,3,2,1,4]',
        expectedOutput: '16',
        rawInput: [[4, 3, 2, 1, 4]],
        rawExpected: 16,
      },
      {
        id: 'cwmw-4',
        input: 'height = [1,2,1]',
        expectedOutput: '2',
        rawInput: [[1, 2, 1]],
        rawExpected: 2,
        isHidden: true,
      }
    ],
  },
  {
    id: 'maximum-subarray',
    title: '8. Maximum Subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    trackId: 'dsa',
    timeEstimateMinutes: 20,
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.',
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    functionName: 'maxSubArray',
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your solution here
  
}
`,
      typescript: `function maxSubArray(nums: number[]): number {
  // Write your solution here
  
}
`,
      python: `from typing import List

def maxSubArray(nums: List[int]) -> int:
    # Write your solution here
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here
        
    }
};
`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
}
`,
      go: `package main

func maxSubArray(nums []int) int {
    // Write your solution here
    
    return 0
}
`,
    },
    testCases: [
      {
        id: 'msa-1',
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
        rawInput: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        rawExpected: 6,
      },
      {
        id: 'msa-2',
        input: 'nums = [1]',
        expectedOutput: '1',
        rawInput: [[1]],
        rawExpected: 1,
      },
      {
        id: 'msa-3',
        input: 'nums = [5,4,-1,7,8]',
        expectedOutput: '23',
        rawInput: [[5, 4, -1, 7, 8]],
        rawExpected: 23,
      },
      {
        id: 'msa-4',
        input: 'nums = [-1]',
        expectedOutput: '-1',
        rawInput: [[-1]],
        rawExpected: -1,
        isHidden: true,
      }
    ],
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: '9. Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays',
    trackId: 'dsa',
    timeEstimateMinutes: 15,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    functionName: 'maxProfit',
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Write your solution here
  
}
`,
      typescript: `function maxProfit(prices: number[]): number {
  // Write your solution here
  
}
`,
      python: `from typing import List

def maxProfit(prices: List[int]) -> int:
    # Write your solution here
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        
    }
};
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        
        return 0;
    }
}
`,
      go: `package main

func maxProfit(prices []int) int {
    // Write your solution here
    
    return 0
}
`,
    },
    testCases: [
      {
        id: 'btbss-1',
        input: 'prices = [7,1,5,3,6,4]',
        expectedOutput: '5',
        rawInput: [[7, 1, 5, 3, 6, 4]],
        rawExpected: 5,
      },
      {
        id: 'btbss-2',
        input: 'prices = [7,6,4,3,1]',
        expectedOutput: '0',
        rawInput: [[7, 6, 4, 3, 1]],
        rawExpected: 0,
      },
      {
        id: 'btbss-3',
        input: 'prices = [1,2]',
        expectedOutput: '1',
        rawInput: [[1, 2]],
        rawExpected: 1,
        isHidden: true,
      }
    ],
  },
];
