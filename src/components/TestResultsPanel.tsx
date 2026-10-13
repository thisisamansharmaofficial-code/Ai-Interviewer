import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  FileCheck,
  Play,
  Terminal,
  XCircle,
  Zap,
} from 'lucide-react';
import { ExecutionResponse, TestCase, TestResult } from '../types/interview';

interface TestResultsPanelProps {
  testCases: TestCase[];
  executionResponse: ExecutionResponse | null;
  isRunning: boolean;
  onRunTests: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  testCases,
  executionResponse,
  isRunning,
  onRunTests,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  // When execution response arrives, auto-switch to 'result' tab
  useEffect(() => {
    if (executionResponse) {
      setActiveTab('result');
    }
  }, [executionResponse]);

  const results = executionResponse?.results || [];
  const currentResult: TestResult | undefined = results[selectedCaseIdx];
  const currentTestCase = testCases[selectedCaseIdx] || testCases[0];

  const passCount = executionResponse?.passCount ?? 0;
  const totalCount = testCases.length;
  const hasRun = executionResponse !== null;

  return (
    <div
      id="panel-test-results"
      className="border-t border-[#262626] bg-[#121212] text-[#eff1f6] flex flex-col shrink-0 h-full"
    >
      {/* Console Tab Bar (LeetCode exact layout) */}
      <div className="px-3 py-1.5 bg-[#222222] border-b border-[#262626] flex items-center justify-between gap-3 select-none shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Testcase Tab */}
          <button
            id="btn-tab-testcase"
            onClick={() => setActiveTab('testcase')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer ${
              activeTab === 'testcase'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-[#8c8c8c] hover:text-[#d0d0d0]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#ffa116]" />
            <span>Testcase</span>
          </button>

          {/* Test Result Tab */}
          <button
            id="btn-tab-test-result"
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer ${
              activeTab === 'result'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-[#8c8c8c] hover:text-[#d0d0d0]'
            }`}
          >
            <FileCheck
              className={`w-3.5 h-3.5 ${
                executionResponse?.allPassed
                  ? 'text-[#2cbb5d]'
                  : executionResponse
                  ? 'text-[#ff375f]'
                  : 'text-[#8c8c8c]'
              }`}
            />
            <span>Test Result</span>
            {hasRun && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  executionResponse.allPassed
                    ? 'bg-[#2cbb5d]/20 text-[#2cbb5d]'
                    : 'bg-[#ff375f]/20 text-[#ff375f]'
                }`}
              >
                {passCount}/{totalCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <button
              id="btn-toggle-results-panel"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand Console' : 'Collapse Console'}
              className="p-1 text-[#8c8c8c] hover:text-white rounded hover:bg-[#2d2d2d] transition-colors active:scale-[0.98] cursor-pointer"
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#121212]">
          {/* TAB 1: TESTCASE VIEW */}
          {activeTab === 'testcase' && (
            <div className="space-y-3">
              {/* Case Selectors */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {testCases.map((tc, idx) => {
                  const isSelected = selectedCaseIdx === idx;
                  return (
                    <button
                      key={tc.id}
                      id={`tab-testcase-item-${idx + 1}`}
                      onClick={() => setSelectedCaseIdx(idx)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#2f2f2f] text-white border border-[#333333]'
                          : 'bg-[#242424] text-[#8c8c8c] hover:text-[#d0d0d0] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Case Input Field Display */}
              {currentTestCase && (
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-[#8c8c8c] font-sans text-xs">Input:</div>
                  <div className="bg-[#262626] border border-[#333333] rounded-lg p-3 text-[#eff1f6] whitespace-pre-wrap">
                    {currentTestCase.input}
                  </div>
                  <div className="text-[#8c8c8c] font-sans text-xs mt-2">Expected Output:</div>
                  <div className="bg-[#262626] border border-[#333333] rounded-lg p-3 text-[#2cbb5d] font-semibold whitespace-pre-wrap">
                    {currentTestCase.expectedOutput}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEST RESULT VIEW */}
          {activeTab === 'result' && (
            <div className="space-y-3">
              {/* If no test has been executed yet */}
              {!hasRun && (
                <div className="text-center py-8 text-[#737373] text-xs space-y-2">
                  <Terminal className="w-6 h-6 mx-auto text-[#5a5a5a]" />
                  <p>You must run your code first to view test results.</p>
                </div>
              )}

              {/* Compiler / Global Runtime Error */}
              {(executionResponse?.compilerError || executionResponse?.runtimeError) && (
                <div className="bg-[#2a1717] border border-[#ff375f]/40 rounded-lg p-3 text-xs text-[#ff8080] flex items-start gap-2.5 font-mono">
                  <AlertCircle className="w-4 h-4 text-[#ff375f] shrink-0 mt-0.5" />
                  <div className="space-y-1 overflow-x-auto w-full">
                    <div className="font-bold text-[#ff9999] font-sans">
                      {executionResponse.compilerError ? 'Compile Error' : 'Runtime Error'}
                    </div>
                    <div className="whitespace-pre-wrap">
                      {executionResponse.compilerError || executionResponse.runtimeError}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Header: Accepted / Wrong Answer Banner */}
              {hasRun && !executionResponse.compilerError && (
                <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-base font-black ${
                        executionResponse.allPassed ? 'text-[#2cbb5d]' : 'text-[#ff375f]'
                      }`}
                    >
                      {executionResponse.allPassed ? 'Accepted' : 'Wrong Answer'}
                    </span>
                    <span className="text-xs text-[#8c8c8c] font-mono">
                      {passCount}/{totalCount} cases passed
                    </span>
                  </div>

                  {currentResult && (
                    <div className="flex items-center gap-2 text-xs text-[#8c8c8c] font-mono">
                      <Clock className="w-3 h-3 text-[#ffa116]" />
                      <span>Runtime: {currentResult.executionTimeMs} ms</span>
                    </div>
                  )}
                </div>
              )}

              {/* Case Selectors with Passed/Failed Indicators */}
              {hasRun && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {testCases.map((tc, idx) => {
                    const res = results[idx];
                    const isSelected = selectedCaseIdx === idx;
                    const isPassed = res?.passed;

                    return (
                      <button
                        key={tc.id}
                        id={`tab-result-case-${idx + 1}`}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#2f2f2f] text-white border border-[#333333]'
                            : 'bg-[#242424] text-[#8c8c8c] hover:text-[#d0d0d0]'
                        }`}
                      >
                        {res ? (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isPassed ? 'bg-[#2cbb5d]' : 'bg-[#ff375f]'
                            }`}
                          />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#5c5c5c]" />
                        )}
                        <span>Case {idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Detailed Output Comparison Container */}
              {hasRun && currentTestCase && (
                <div className="bg-[#242424] border border-[#333333] rounded-lg p-3 space-y-3 text-xs font-mono">
                  {/* Input Block */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-[#8c8c8c] font-sans">Input</div>
                    <div className="bg-[#121212] p-2.5 rounded border border-[#2e2e2e] text-[#eff1f6] whitespace-pre-wrap break-all">
                      {currentResult?.inputDisplay || currentTestCase.input}
                    </div>
                  </div>

                  {/* Output vs Expected Output */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-[#8c8c8c] font-sans">Output</div>
                    <div
                      className={`p-2.5 rounded border whitespace-pre-wrap break-all ${
                        currentResult?.passed
                          ? 'bg-[#121212] border-[#2cbb5d]/30 text-[#2cbb5d] font-semibold'
                          : 'bg-[#121212] border-[#ff375f]/40 text-[#ff7085] font-semibold'
                      }`}
                    >
                      {currentResult?.actualDisplay || 'No output'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-[#8c8c8c] font-sans">Expected</div>
                    <div className="bg-[#121212] p-2.5 rounded border border-[#2e2e2e] text-[#2cbb5d] font-semibold whitespace-pre-wrap break-all">
                      {currentResult?.expectedDisplay || currentTestCase.expectedOutput}
                    </div>
                  </div>

                  {/* Stdout Logs */}
                  {currentResult?.stdout && (
                    <div className="space-y-1 pt-2 border-t border-[#2e2e2e]">
                      <div className="text-[11px] text-[#8c8c8c] font-sans flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-[#ffa116]" />
                        <span>Stdout</span>
                      </div>
                      <div className="bg-[#121212] p-2.5 rounded border border-[#2e2e2e] text-[#cfcfcf] whitespace-pre-wrap font-mono text-[11px]">
                        {currentResult.stdout}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
