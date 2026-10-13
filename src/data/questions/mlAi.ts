import { Question } from '../../types/interview';

export const ML_AI_QUESTIONS: Question[] = [
  {
    id: 'cosine-similarity-search',
    title: '1. Vector Embeddings Cosine Similarity Search',
    difficulty: 'Medium',
    category: 'Machine Learning & AI Engineering',
    trackId: 'ml_ai',
    timeEstimateMinutes: 20,
    description: `Implement vector search retrieval used in RAG (Retrieval-Augmented Generation) and Vector Databases.

Given a query vector \`queryVector\`, a list of documents \`documents\` where each document has \`{ id: string, vector: number[] }\`, and an integer \`k\`, return the \`id\`s of the top \`k\` most similar documents sorted by **descending cosine similarity**.

### Mathematical Formula:
$$\\text{Cosine Similarity}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|} = \\frac{\\sum_{i=1}^n A_i B_i}{\\sqrt{\\sum_{i=1}^n A_i^2} \\cdot \\sqrt{\\sum_{i=1}^n B_i^2}}$$

If two documents have the same similarity score, preserve their original relative order.`,
    examples: [
      {
        input: 'queryVector = [1, 0], documents = [{id: "doc1", vector: [1, 0]}, {id: "doc2", vector: [0, 1]}, {id: "doc3", vector: [0.7, 0.7]}], k = 2',
        output: '["doc1", "doc3"]',
        explanation: 'doc1 has similarity 1.0, doc3 has ~0.99, doc2 has 0.0.',
      },
    ],
    constraints: [
      '1 <= documents.length <= 1000',
      'vector dimensions are identical and non-zero',
      '1 <= k <= documents.length',
    ],
    functionName: 'topKSimilar',
    starterCode: {
      javascript: `/**
 * @param {number[]} queryVector
 * @param {Array<{id: string, vector: number[]}>} documents
 * @param {number} k
 * @return {string[]}
 */
function topKSimilar(queryVector, documents, k) {
  function cosineSim(v1, v2) {
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }
    const mag = Math.sqrt(norm1) * Math.sqrt(norm2);
    return mag === 0 ? 0 : dot / mag;
  }

  const scored = documents.map((doc, idx) => ({
    id: doc.id,
    sim: cosineSim(queryVector, doc.vector),
    idx,
  }));

  scored.sort((a, b) => {
    if (Math.abs(b.sim - a.sim) > 1e-6) return b.sim - a.sim;
    return a.idx - b.idx;
  });

  return scored.slice(0, k).map((item) => item.id);
}
`,
      typescript: `function topKSimilar(
  queryVector: number[],
  documents: { id: string; vector: number[] }[],
  k: number
): string[] {
  function cosineSim(v1: number[], v2: number[]): number {
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }
    const mag = Math.sqrt(norm1) * Math.sqrt(norm2);
    return mag === 0 ? 0 : dot / mag;
  }

  const scored = documents.map((doc, idx) => ({
    id: doc.id,
    sim: cosineSim(queryVector, doc.vector),
    idx,
  }));

  scored.sort((a, b) => {
    if (Math.abs(b.sim - a.sim) > 1e-6) return b.sim - a.sim;
    return a.idx - b.idx;
  });

  return scored.slice(0, k).map((item) => item.id);
}
`,
      python: `import math

def topKSimilar(queryVector: list[float], documents: list[dict], k: int) -> list[str]:
    def cosine_sim(v1, v2):
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))
        return dot / (norm1 * norm2) if (norm1 * norm2) != 0 else 0

    scored = [(doc['id'], cosine_sim(queryVector, doc['vector']), i) for i, doc in enumerate(documents)]
    scored.sort(key=lambda x: (-x[1], x[2]))
    return [item[0] for item in scored[:k]]
`,
      cpp: `#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
using namespace std;

struct Doc {
    string id;
    vector<double> vector;
};

class Solution {
public:
    vector<string> topKSimilar(vector<double>& queryVector, vector<Doc>& documents, int k) {
        vector<pair<double, string>> scored;
        for (const auto& doc : documents) {
            double dot = 0, norm1 = 0, norm2 = 0;
            for (int i = 0; i < (int)queryVector.size(); i++) {
                dot += queryVector[i] * doc.vector[i];
                norm1 += queryVector[i] * queryVector[i];
                norm2 += doc.vector[i] * doc.vector[i];
            }
            double sim = dot / (sqrt(norm1) * sqrt(norm2));
            scored.push_back({sim, doc.id});
        }
        sort(scored.begin(), scored.end(), [](const auto& a, const auto& b) {
            return a.first > b.first;
        });
        vector<string> result;
        for (int i = 0; i < min(k, (int)scored.size()); i++) {
            result.push_back(scored[i].second);
        }
        return result;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public static class Doc {
        public String id;
        public double[] vector;
    }

    public List<String> topKSimilar(double[] queryVector, List<Doc> documents, int k) {
        List<String> result = new ArrayList<>();
        // Implementation
        return result;
    }
}
`,
      go: `package main

import (
    "math"
    "sort"
)

func topKSimilar(queryVector []float64, documents []map[string]interface{}, k int) []string {
    type DocScore struct {
        id  string
        sim float64
        idx int
    }
    var scores []DocScore
    for i, doc := range documents {
        id := doc["id"].(string)
        vecRaw := doc["vector"].([]interface{})
        var dot, norm1, norm2 float64
        for j := 0; j < len(queryVector); j++ {
            val := vecRaw[j].(float64)
            dot += queryVector[j] * val
            norm1 += queryVector[j] * queryVector[j]
            norm2 += val * val
        }
        sim := dot / (math.Sqrt(norm1) * math.Sqrt(norm2))
        scores = append(scores, DocScore{id: id, sim: sim, idx: i})
    }
    sort.Slice(scores, func(i, j int) bool {
        if math.Abs(scores[i].sim-scores[j].sim) > 1e-6 {
            return scores[i].sim > scores[j].sim
        }
        return scores[i].idx < scores[j].idx
    })
    var res []string
    for i := 0; i < k && i < len(scores); i++ {
        res = append(res, scores[i].id)
    }
    return res
}
`,
    },
    testCases: [
      {
        id: 'cs-1',
        input: 'queryVector = [1, 0], documents = [{id: "doc1", vector: [1, 0]}, {id: "doc2", vector: [0, 1]}, {id: "doc3", vector: [0.7, 0.7]}], k = 2',
        expectedOutput: '["doc1", "doc3"]',
        rawInput: [
          [1, 0],
          [
            { id: 'doc1', vector: [1, 0] },
            { id: 'doc2', vector: [0, 1] },
            { id: 'doc3', vector: [0.7, 0.7] },
          ],
          2,
        ],
        rawExpected: ['doc1', 'doc3'],
      },
      {
        id: 'cs-2',
        input: 'queryVector = [0, 5, 0], documents = [{id: "alpha", vector: [0, 1, 0]}, {id: "beta", vector: [1, 1, 0]}], k = 1',
        expectedOutput: '["alpha"]',
        rawInput: [
          [0, 5, 0],
          [
            { id: 'alpha', vector: [0, 1, 0] },
            { id: 'beta', vector: [1, 1, 0] },
          ],
          1,
        ],
        rawExpected: ['alpha'],
      },
    ],
  },
  {
    id: 'softmax-cross-entropy',
    title: '2. Softmax & Categorical Cross-Entropy Loss',
    difficulty: 'Medium',
    category: 'Machine Learning & AI Engineering',
    trackId: 'ml_ai',
    timeEstimateMinutes: 20,
    description: `Implement the foundational loss computation used in Neural Network classification: **Softmax Activation** and **Categorical Cross-Entropy Loss**.

Given an array of raw model output scores \`logits\` and the index of the true class label \`targetIndex\`:
1. Apply the numerically stable Softmax function:
   $$P_i = \\frac{e^{z_i - \\max(z)}}{\\sum_j e^{z_j - \\max(z)}}$$
2. Compute the Cross-Entropy loss for the target class:
   $$\\mathcal{L} = -\\ln(P_{\\text{targetIndex}})$$
3. Return the loss rounded to **4 decimal places**.`,
    examples: [
      {
        input: 'logits = [2.0, 1.0, 0.1], targetIndex = 0',
        output: '0.417',
        explanation: 'Softmax probabilities are approx [0.659, 0.242, 0.099]. Loss is -ln(0.659) = 0.417.',
      },
    ],
    constraints: [
      '2 <= logits.length <= 1000',
      '0 <= targetIndex < logits.length',
    ],
    functionName: 'computeCrossEntropyLoss',
    starterCode: {
      javascript: `/**
 * @param {number[]} logits
 * @param {number} targetIndex
 * @return {number}
 */
function computeCrossEntropyLoss(logits, targetIndex) {
  const maxLogit = Math.max(...logits);
  const expScores = logits.map((x) => Math.exp(x - maxLogit));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const targetProb = expScores[targetIndex] / sumExp;
  const loss = -Math.log(targetProb);
  return Math.round(loss * 10000) / 10000;
}
`,
      typescript: `function computeCrossEntropyLoss(logits: number[], targetIndex: number): number {
  const maxLogit = Math.max(...logits);
  const expScores = logits.map((x) => Math.exp(x - maxLogit));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const targetProb = expScores[targetIndex] / sumExp;
  const loss = -Math.log(targetProb);
  return Math.round(loss * 10000) / 10000;
}
`,
      python: `import math

def computeCrossEntropyLoss(logits: list[float], targetIndex: int) -> float:
    max_logit = max(logits)
    exp_scores = [math.exp(x - max_logit) for x in logits]
    sum_exp = sum(exp_scores)
    target_prob = exp_scores[targetIndex] / sum_exp
    loss = -math.log(target_prob)
    return round(loss, 4)
`,
      cpp: `#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

class Solution {
public:
    double computeCrossEntropyLoss(vector<double>& logits, int targetIndex) {
        double maxLogit = *max_element(logits.begin(), logits.end());
        double sumExp = 0;
        vector<double> expScores;
        for (double x : logits) {
            double e = exp(x - maxLogit);
            expScores.push_back(e);
            sumExp += e;
        }
        double targetProb = expScores[targetIndex] / sumExp;
        return round(-log(targetProb) * 10000.0) / 10000.0;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public double computeCrossEntropyLoss(double[] logits, int targetIndex) {
        double maxLogit = Double.NEGATIVE_INFINITY;
        for (double x : logits) if (x > maxLogit) maxLogit = x;
        double sumExp = 0;
        double[] expScores = new double[logits.length];
        for (int i = 0; i < logits.length; i++) {
            expScores[i] = Math.exp(logits[i] - maxLogit);
            sumExp += expScores[i];
        }
        double targetProb = expScores[targetIndex] / sumExp;
        return Math.round(-Math.log(targetProb) * 10000.0) / 10000.0;
    }
}
`,
      go: `package main

import "math"

func computeCrossEntropyLoss(logits []float64, targetIndex int) float64 {
    maxLogit := logits[0]
    for _, x := range logits {
        if x > maxLogit {
            maxLogit = x
        }
    }
    var sumExp float64
    expScores := make([]float64, len(logits))
    for i, x := range logits {
        expScores[i] = math.Exp(x - maxLogit)
        sumExp += expScores[i]
    }
    targetProb := expScores[targetIndex] / sumExp
    loss := -math.Log(targetProb)
    return math.Round(loss*10000) / 10000
}
`,
    },
    testCases: [
      {
        id: 'scl-1',
        input: 'logits = [2.0, 1.0, 0.1], targetIndex = 0',
        expectedOutput: '0.417',
        rawInput: [[2.0, 1.0, 0.1], 0],
        rawExpected: 0.417,
      },
      {
        id: 'scl-2',
        input: 'logits = [1.0, 1.0], targetIndex = 1',
        expectedOutput: '0.6931',
        rawInput: [[1.0, 1.0], 1],
        rawExpected: 0.6931,
      },
    ],
  },
  {
    id: 'tfidf-vectorizer',
    title: '3. TF-IDF Text Feature Extractor',
    difficulty: 'Medium',
    category: 'Machine Learning & AI Engineering',
    trackId: 'ml_ai',
    timeEstimateMinutes: 20,
    description: `Implement the **TF-IDF** (Term Frequency-Inverse Document Frequency) numerical score generator for information retrieval.

Given a corpus of documents \`corpus\` (array of arrays of lowercase words) and a \`queryTerm\`:
1. Calculate **TF** for each document: $\\text{TF}(t, d) = \\frac{\\text{count}(t \\text{ in } d)}{\\text{total words in } d}$.
2. Calculate smooth **IDF** across the entire corpus:
   $$\\text{IDF}(t) = \\ln\\left(\\frac{N}{1 + \\text{count}(\\text{docs containing } t)}\\right) + 1$$
   where $N$ is the total number of documents.
3. Compute $\\text{TF-IDF}(t, d) = \\text{TF}(t, d) \\times \\text{IDF}(t)$.
4. Return an array of TF-IDF values (one per document) rounded to **4 decimal places**.`,
    examples: [
      {
        input: 'corpus = [["ai", "model", "ai"], ["data", "science"], ["ai", "data"]], queryTerm = "ai"',
        output: '[0.9996, 0, 0.7497]',
      },
    ],
    constraints: [
      '1 <= corpus.length <= 100',
      'each document has at least 1 word',
    ],
    functionName: 'computeTFIDF',
    starterCode: {
      javascript: `/**
 * @param {string[][]} corpus
 * @param {string} queryTerm
 * @return {number[]}
 */
function computeTFIDF(corpus, queryTerm) {
  const N = corpus.length;
  let docsWithTerm = 0;
  for (const doc of corpus) {
    if (doc.includes(queryTerm)) docsWithTerm++;
  }

  const idf = Math.log(N / (1 + docsWithTerm)) + 1;

  return corpus.map((doc) => {
    const termCount = doc.filter((w) => w === queryTerm).length;
    const tf = termCount / doc.length;
    return Math.round(tf * idf * 10000) / 10000;
  });
}
`,
      typescript: `function computeTFIDF(corpus: string[][], queryTerm: string): number[] {
  const N = corpus.length;
  let docsWithTerm = 0;
  for (const doc of corpus) {
    if (doc.includes(queryTerm)) docsWithTerm++;
  }

  const idf = Math.log(N / (1 + docsWithTerm)) + 1;

  return corpus.map((doc) => {
    const termCount = doc.filter((w) => w === queryTerm).length;
    const tf = termCount / doc.length;
    return Math.round(tf * idf * 10000) / 10000;
  });
}
`,
      python: `import math

def computeTFIDF(corpus: list[list[str]], queryTerm: str) -> list[float]:
    N = len(corpus)
    docs_with_term = sum(1 for doc in corpus if queryTerm in doc)
    idf = math.log(N / (1 + docs_with_term)) + 1

    result = []
    for doc in corpus:
        tf = doc.count(queryTerm) / len(doc)
        result.append(round(tf * idf, 4))
    return result
`,
      cpp: `#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<double> computeTFIDF(vector<vector<string>>& corpus, string queryTerm) {
        int N = corpus.size();
        int docsWithTerm = 0;
        for (const auto& doc : corpus) {
            if (find(doc.begin(), doc.end(), queryTerm) != doc.end()) docsWithTerm++;
        }
        double idf = log((double)N / (1 + docsWithTerm)) + 1.0;
        vector<double> res;
        for (const auto& doc : corpus) {
            int cnt = count(doc.begin(), doc.end(), queryTerm);
            double tf = (double)cnt / doc.size();
            res.push_back(round(tf * idf * 10000.0) / 10000.0);
        }
        return res;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public double[] computeTFIDF(String[][] corpus, String queryTerm) {
        int N = corpus.length;
        int docsWithTerm = 0;
        for (String[] doc : corpus) {
            for (String w : doc) {
                if (w.equals(queryTerm)) { docsWithTerm++; break; }
            }
        }
        double idf = Math.log((double) N / (1 + docsWithTerm)) + 1.0;
        double[] res = new double[N];
        for (int i = 0; i < N; i++) {
            int cnt = 0;
            for (String w : corpus[i]) if (w.equals(queryTerm)) cnt++;
            double tf = (double) cnt / corpus[i].length;
            res[i] = Math.round(tf * idf * 10000.0) / 10000.0;
        }
        return res;
    }
}
`,
      go: `package main

import "math"

func computeTFIDF(corpus [][]string, queryTerm string) []float64 {
    N := float64(len(corpus))
    var docsWithTerm float64
    for _, doc := range corpus {
        for _, w := range doc {
            if w == queryTerm {
                docsWithTerm++
                break
            }
        }
    }
    idf := math.Log(N/(1+docsWithTerm)) + 1
    res := make([]float64, len(corpus))
    for i, doc := range corpus {
        var cnt float64
        for _, w := range doc {
            if w == queryTerm {
                cnt++
            }
        }
        tf := cnt / float64(len(doc))
        res[i] = math.Round(tf*idf*10000) / 10000
    }
    return res
}
`,
    },
    testCases: [
      {
        id: 'tf-1',
        input: 'corpus = [["ai", "model", "ai"], ["data", "science"], ["ai", "data"]], queryTerm = "ai"',
        expectedOutput: '[0.6667, 0, 0.5]',
        rawInput: [
          [
            ['ai', 'model', 'ai'],
            ['data', 'science'],
            ['ai', 'data'],
          ],
          'ai',
        ],
        rawExpected: [0.6667, 0, 0.5],
      },
    ],
  },
  {
    id: 'precision-recall-f1',
    title: '4. Binary Classification Metrics Evaluator',
    difficulty: 'Easy',
    category: 'Machine Learning & AI Engineering',
    trackId: 'ml_ai',
    timeEstimateMinutes: 15,
    description: `Implement the evaluation suite used to assess ML classifiers: **Accuracy**, **Precision**, **Recall**, and **F1-Score**.

Given binary arrays \`predictions\` and \`groundTruth\` containing \`0\` or \`1\`:
- **TP** (True Positives): \`pred == 1 && truth == 1\`
- **FP** (False Positives): \`pred == 1 && truth == 0\`
- **TN** (True Negatives): \`pred == 0 && truth == 0\`
- **FN** (False Negatives): \`pred == 0 && truth == 1\`

Formulas:
- $\\text{Accuracy} = \\frac{TP + TN}{Total}$
- $\\text{Precision} = \\frac{TP}{TP + FP}$ (return \`0\` if $TP + FP = 0$)
- $\\text{Recall} = \\frac{TP}{TP + FN}$ (return \`0\` if $TP + FN = 0$)
- $\\text{F1} = \\frac{2 \\cdot \\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$ (return \`0\` if $\\text{Precision} + \\text{Recall} = 0$)

Return an object with \`{ accuracy, precision, recall, f1 }\` rounded to **2 decimal places**.`,
    examples: [
      {
        input: 'predictions = [1, 1, 0, 1], groundTruth = [1, 0, 0, 1]',
        output: '{"accuracy": 0.75, "precision": 0.67, "recall": 1.0, "f1": 0.8}',
      },
    ],
    constraints: [
      '1 <= predictions.length <= 10^5',
      'predictions.length == groundTruth.length',
    ],
    functionName: 'evaluateClassifierMetrics',
    starterCode: {
      javascript: `/**
 * @param {number[]} predictions
 * @param {number[]} groundTruth
 * @return {{accuracy: number, precision: number, recall: number, f1: number}}
 */
function evaluateClassifierMetrics(predictions, groundTruth) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (let i = 0; i < predictions.length; i++) {
    const p = predictions[i], g = groundTruth[i];
    if (p === 1 && g === 1) tp++;
    else if (p === 1 && g === 0) fp++;
    else if (p === 0 && g === 0) tn++;
    else if (p === 0 && g === 1) fn++;
  }

  const total = predictions.length;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  const r = (n) => Math.round(n * 100) / 100;
  return {
    accuracy: r(accuracy),
    precision: r(precision),
    recall: r(recall),
    f1: r(f1),
  };
}
`,
      typescript: `function evaluateClassifierMetrics(
  predictions: number[],
  groundTruth: number[]
): { accuracy: number; precision: number; recall: number; f1: number } {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (let i = 0; i < predictions.length; i++) {
    const p = predictions[i], g = groundTruth[i];
    if (p === 1 && g === 1) tp++;
    else if (p === 1 && g === 0) fp++;
    else if (p === 0 && g === 0) tn++;
    else if (p === 0 && g === 1) fn++;
  }

  const total = predictions.length;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    accuracy: r(accuracy),
    precision: r(precision),
    recall: r(recall),
    f1: r(f1),
  };
}
`,
      python: `def evaluateClassifierMetrics(predictions: list[int], groundTruth: list[int]) -> dict:
    tp = sum(1 for p, g in zip(predictions, groundTruth) if p == 1 and g == 1)
    fp = sum(1 for p, g in zip(predictions, groundTruth) if p == 1 and g == 0)
    tn = sum(1 for p, g in zip(predictions, groundTruth) if p == 0 and g == 0)
    fn = sum(1 for p, g in zip(predictions, groundTruth) if p == 0 and g == 1)

    total = len(predictions)
    accuracy = (tp + tn) / total
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

    return {
        "accuracy": round(accuracy, 2),
        "precision": round(precision, 2),
        "recall": round(recall, 2),
        "f1": round(f1, 2)
    }
`,
      cpp: `#include <vector>
#include <cmath>
using namespace std;

struct Metrics {
    double accuracy;
    double precision;
    double recall;
    double f1;
};

class Solution {
public:
    Metrics evaluateClassifierMetrics(vector<int>& predictions, vector<int>& groundTruth) {
        int tp = 0, fp = 0, tn = 0, fn = 0;
        for (size_t i = 0; i < predictions.size(); i++) {
            if (predictions[i] == 1 && groundTruth[i] == 1) tp++;
            else if (predictions[i] == 1 && groundTruth[i] == 0) fp++;
            else if (predictions[i] == 0 && groundTruth[i] == 0) tn++;
            else if (predictions[i] == 0 && groundTruth[i] == 1) fn++;
        }
        double acc = (double)(tp + tn) / predictions.size();
        double prec = (tp + fp == 0) ? 0 : (double)tp / (tp + fp);
        double rec = (tp + fn == 0) ? 0 : (double)tp / (tp + fn);
        double f1 = (prec + rec == 0) ? 0 : (2 * prec * rec) / (prec + rec);
        return {round(acc * 100.0) / 100.0, round(prec * 100.0) / 100.0, round(rec * 100.0) / 100.0, round(f1 * 100.0) / 100.0};
    }
};
`,
      java: `import java.util.*;

class Solution {
    public Map<String, Double> evaluateClassifierMetrics(int[] predictions, int[] groundTruth) {
        int tp = 0, fp = 0, tn = 0, fn = 0;
        for (int i = 0; i < predictions.length; i++) {
            if (predictions[i] == 1 && groundTruth[i] == 1) tp++;
            else if (predictions[i] == 1 && groundTruth[i] == 0) fp++;
            else if (predictions[i] == 0 && groundTruth[i] == 0) tn++;
            else if (predictions[i] == 0 && groundTruth[i] == 1) fn++;
        }
        double acc = (double)(tp + tn) / predictions.length;
        double prec = (tp + fp == 0) ? 0 : (double)tp / (tp + fp);
        double rec = (tp + fn == 0) ? 0 : (double)tp / (tp + fn);
        double f1 = (prec + rec == 0) ? 0 : (2 * prec * rec) / (prec + rec);
        Map<String, Double> map = new HashMap<>();
        map.put("accuracy", Math.round(acc * 100.0) / 100.0);
        map.put("precision", Math.round(prec * 100.0) / 100.0);
        map.put("recall", Math.round(rec * 100.0) / 100.0);
        map.put("f1", Math.round(f1 * 100.0) / 100.0);
        return map;
    }
}
`,
      go: `package main

import "math"

func evaluateClassifierMetrics(predictions []int, groundTruth []int) map[string]float64 {
    var tp, fp, tn, fn float64
    for i := 0; i < len(predictions); i++ {
        p := predictions[i]
        g := groundTruth[i]
        if p == 1 && g == 1 {
            tp++
        } else if p == 1 && g == 0 {
            fp++
        } else if p == 0 && g == 0 {
            tn++
        } else if p == 0 && g == 1 {
            fn++
        }
    }
    total := float64(len(predictions))
    acc := (tp + tn) / total
    var prec, rec, f1 float64
    if tp+fp > 0 {
        prec = tp / (tp + fp)
    }
    if tp+fn > 0 {
        rec = tp / (tp + fn)
    }
    if prec+rec > 0 {
        f1 = (2 * prec * rec) / (prec + rec)
    }
    r := func(n float64) float64 { return math.Round(n*100) / 100 }
    return map[string]float64{
        "accuracy":  r(acc),
        "precision": r(prec),
        "recall":    r(rec),
        "f1":        r(f1),
    }
}
`,
    },
    testCases: [
      {
        id: 'cm-1',
        input: 'predictions = [1, 1, 0, 1], groundTruth = [1, 0, 0, 1]',
        expectedOutput: '{"accuracy": 0.75, "precision": 0.67, "recall": 1.0, "f1": 0.8}',
        rawInput: [
          [1, 1, 0, 1],
          [1, 0, 0, 1],
        ],
        rawExpected: { accuracy: 0.75, precision: 0.67, recall: 1.0, f1: 0.8 },
      },
    ],
  },
];
