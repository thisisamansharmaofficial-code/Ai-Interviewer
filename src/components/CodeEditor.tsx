import React, { useRef, useState } from 'react';
import Editor, { DiffEditor, OnMount } from '@monaco-editor/react';
import * as prettier from 'prettier/standalone';
import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import {
  Check,
  ChevronDown,
  Code2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  GitCompare,
} from 'lucide-react';
import { SupportedLanguage } from '../types/interview';

interface CodeEditorProps {
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  code: string;
  onChangeCode: (code: string) => void;
  onResetCode: () => void;
  onRunTests: () => void;
  isRunningTests: boolean;
  starterCode: string;
  testExecutionResponse?: any;
}

const LANGUAGES: {
  id: SupportedLanguage;
  label: string;
  shortLabel: string;
  monacoLang: string;
  printHint: string;
}[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    shortLabel: 'JS',
    monacoLang: 'javascript',
    printHint: 'console.log(...)',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    shortLabel: 'TS',
    monacoLang: 'typescript',
    printHint: 'console.log(...)',
  },
  {
    id: 'python',
    label: 'Python3',
    shortLabel: 'Python3',
    monacoLang: 'python',
    printHint: 'print(...)',
  },
  {
    id: 'cpp',
    label: 'C++',
    shortLabel: 'C++',
    monacoLang: 'cpp',
    printHint: 'cout << ...',
  },
  {
    id: 'java',
    label: 'Java',
    shortLabel: 'Java',
    monacoLang: 'java',
    printHint: 'System.out.println(...)',
  },
  {
    id: 'go',
    label: 'Go',
    shortLabel: 'Go',
    monacoLang: 'go',
    printHint: 'fmt.Println(...)',
  },
];


export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onChangeLanguage,
  code,
  onChangeCode,
  onResetCode,
  onRunTests,
  isRunningTests,
  starterCode,
  testExecutionResponse,
}) => {
  const editorRef = useRef<any>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showChanges, setShowChanges] = useState(false);

  const activeLangConfig = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const handleDiffMount = (editor: any, monaco: any) => {
    // Define LeetCode dark editor theme
    monaco.editor.defineTheme('leetcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c586c0' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'type', foreground: '4ec9b0' },
        { token: 'function', foreground: 'dcdcaa' },
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#eff1f6',
        'editor.lineHighlightBackground': '#262626',
        'editorLineNumber.foreground': '#5c5c5c',
        'editorLineNumber.activeForeground': '#eff1f6',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#ffa116',
        'editorGutter.background': '#1a1a1a',
      },
    });
    monaco.editor.setTheme('leetcode-dark');

    const modifiedEditor = editor.getModifiedEditor();
    editorRef.current = modifiedEditor;
    modifiedEditor.onDidChangeModelContent(() => {
      onChangeCode(modifiedEditor.getValue());
    });
    
    modifiedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunTests();
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define LeetCode dark editor theme
    monaco.editor.defineTheme('leetcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c586c0' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'type', foreground: '4ec9b0' },
        { token: 'function', foreground: 'dcdcaa' },
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#eff1f6',
        'editor.lineHighlightBackground': '#262626',
        'editorLineNumber.foreground': '#5c5c5c',
        'editorLineNumber.activeForeground': '#eff1f6',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#ffa116',
        'editorGutter.background': '#1a1a1a',
      },
    });
    monaco.editor.setTheme('leetcode-dark');

    // Add keybinding for Run: Ctrl/Cmd + Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunTests();
    });
  };

  const handleFormatCode = async () => {
    if (!editorRef.current) return;

    if (language === 'javascript' || language === 'typescript') {
      try {
        const unformatted = editorRef.current.getValue();
        const formatted = await prettier.format(unformatted, {
          parser: 'babel',
          plugins: [babel, estree],
          singleQuote: true,
          trailingComma: 'es5',
        });
        
        // Push the edit operation to preserve undo stack
        const fullRange = editorRef.current.getModel().getFullModelRange();
        editorRef.current.executeEdits('prettier', [{
          range: fullRange,
          text: formatted,
          forceMoveMarkers: true,
        }]);
        onChangeCode(formatted);
      } catch (err) {
        console.error('Prettier formatting failed:', err);
        // Fallback to Monaco's format if Prettier fails
        editorRef.current.trigger('editor', 'editor.action.formatDocument', null);
      }
    } else {
      // For other languages, try Monaco's default
      editorRef.current.trigger('editor', 'editor.action.formatDocument', null);
    }
  };

  return (
    <div id="panel-code-editor" className="h-full flex flex-col bg-[#121212] text-[#eff1f6]">
      {/* LeetCode Editor Toolbar */}
      <div className="px-3.5 py-2 border-b border-[#262626] bg-[#222222] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 relative">
          {/* Language Selector Dropdown Button (LeetCode exact style) */}
          <div className="relative">
            <button
              id="btn-lang-dropdown"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#383838] border border-[#333333] px-3 py-1 rounded-md text-xs font-semibold text-white transition-colors active:scale-[0.98] cursor-pointer"
            >
              <span>{activeLangConfig.label}</span>
              <ChevronDown className="w-3 h-3 text-[#999999]" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-44 bg-[#262626] border border-[#3a3a3a] rounded-lg shadow-2xl py-1 z-50 overflow-hidden">
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#888888] uppercase tracking-wider">
                    Select Language
                  </div>
                  {LANGUAGES.map((lang) => {
                    const isSelected = language === lang.id;
                    return (
                      <button
                        key={lang.id}
                        id={`btn-select-lang-${lang.id}`}
                        onClick={() => {
                          onChangeLanguage(lang.id);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#333333] transition-colors active:scale-[0.98] cursor-pointer ${
                          isSelected ? 'bg-[#333333] text-[#ffa116] font-semibold' : 'text-[#d0d0d0]'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ffa116]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <span className="text-[11px] text-[#787878] hidden lg:inline ml-2">
            Auto-save enabled
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-show-changes"
            onClick={() => setShowChanges(!showChanges)}
            title="Toggle Diff View"
            className={`text-xs px-2.5 py-1 rounded-md transition-colors active:scale-[0.98] flex items-center gap-1 cursor-pointer border ${
              showChanges
                ? 'bg-[#ffa116]/10 text-[#ffa116] border-[#ffa116]/30 hover:bg-[#ffa116]/20'
                : 'text-[#a0a0a0] hover:text-white bg-[#2d2d2d] hover:bg-[#383838] border-[#333333]'
            }`}
          >
            <GitCompare className="w-3 h-3" />
            <span className="hidden sm:inline">{showChanges ? 'Hide Changes' : 'Show Changes'}</span>
          </button>
          <button
            id="btn-format-code"
            onClick={handleFormatCode}
            title="Format Code"
            className="text-xs text-[#a0a0a0] hover:text-white bg-[#2d2d2d] hover:bg-[#383838] border border-[#333333] px-2.5 py-1 rounded-md transition-colors active:scale-[0.98] flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#ffa116]" />
            <span className="hidden sm:inline">Format</span>
          </button>

          <button
            id="btn-reset-code"
            onClick={onResetCode}
            title="Reset code to starter template"
            className="text-xs text-[#a0a0a0] hover:text-[#ff375f] bg-[#2d2d2d] hover:bg-[#383838] border border-[#333333] hover:border-[#ff375f]/30 px-2.5 py-1 rounded-md transition-colors active:scale-[0.98] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Test Progress Bar */}
      {testExecutionResponse && (
        <div className="bg-[#1e1e1e] border-b border-[#262626] px-3.5 py-1.5 flex items-center gap-3 shrink-0">
          <div className="flex-1 h-1.5 bg-[#333] rounded-full overflow-hidden flex">
            {testExecutionResponse.totalCount > 0 ? (
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  testExecutionResponse.allPassed ? 'bg-[#2cbb5d]' : 'bg-[#ffa116]'
                }`}
                style={{
                  width: `${(testExecutionResponse.passCount / testExecutionResponse.totalCount) * 100}%`,
                }}
              />
            ) : testExecutionResponse.compilerError || testExecutionResponse.runtimeError ? (
              <div className="h-full w-full bg-[#ef4743]" />
            ) : null}
          </div>
          <div className="text-[10px] font-mono text-[#a0a0a0] min-w-[80px] text-right">
            {testExecutionResponse.totalCount > 0 ? (
              <span className={testExecutionResponse.allPassed ? 'text-[#2cbb5d]' : 'text-[#ffa116]'}>
                {testExecutionResponse.passCount} / {testExecutionResponse.totalCount} Passed
              </span>
            ) : (
              <span className="text-[#ef4743]">Error</span>
            )}
          </div>
        </div>
      )}

      {/* Code Editor Space */}
      <div className="flex-1 relative min-h-0 bg-[#121212]">
        {showChanges ? (
          <DiffEditor
            height="100%"
            language={activeLangConfig.monacoLang}
            original={starterCode}
            modified={code}
            theme="leetcode-dark"
            onMount={handleDiffMount}
            options={{
              fontSize: 13,
              fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineNumbers: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              automaticLayout: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              bracketPairColorization: { enabled: true },
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
              renderSideBySide: false, // Inline diff view by default looks cleaner in small panels
            }}
          />
        ) : (
          <Editor
            height="100%"
            language={activeLangConfig.monacoLang}
            value={code}
            theme="leetcode-dark"
            onChange={(val) => onChangeCode(val || '')}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 13,
              fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineNumbers: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              automaticLayout: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              bracketPairColorization: { enabled: true },
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
            }}
          />
        )}
      </div>
    </div>
  );
};
