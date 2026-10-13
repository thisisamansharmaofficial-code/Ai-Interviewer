import { Question } from '../../types/interview';

export const DATA_SQL_QUESTIONS: Question[] = [
  {
    id: 'sql-select-engine',
    title: '1. In-Memory SQL Query Engine',
    difficulty: 'Medium',
    category: 'Database & SQL / Data Engineering',
    trackId: 'data_sql',
    timeEstimateMinutes: 20,
    description: `Implement a mini in-memory SQL query engine that can process \`SELECT\`, \`WHERE\`, \`ORDER BY\`, and \`LIMIT\` queries on JSON row collections.

Given:
- \`records\`: array of row objects
- \`selectFields\`: array of column names to project in the output
- \`whereFilter\`: optional \`{ field: string, operator: ">=" | "<=" | "==" | "!=" | "contains", value: any }\`
- \`orderBy\`: optional \`{ field: string, direction: "ASC" | "DESC" }\`
- \`limit\`: optional maximum row count

Return the resulting array of projected row objects.`,
    examples: [
      {
        input: 'records = [{id: 1, name: "Alice", age: 30}, {id: 2, name: "Bob", age: 24}, {id: 3, name: "Charlie", age: 35}], selectFields = ["name", "age"], whereFilter = {field: "age", operator: ">=", value: 30}, orderBy = {field: "age", direction: "DESC"}',
        output: '[{"name": "Charlie", "age": 35}, {"name": "Alice", "age": 30}]',
      },
    ],
    constraints: [
      '0 <= records.length <= 1000',
      'selectFields contains valid keys from records',
    ],
    functionName: 'executeSqlQuery',
    starterCode: {
      javascript: `/**
 * @param {Array<Object>} records
 * @param {string[]} selectFields
 * @param {Object} [whereFilter]
 * @param {Object} [orderBy]
 * @param {number} [limit]
 * @return {Array<Object>}
 */
function executeSqlQuery(records, selectFields, whereFilter, orderBy, limit) {
  let rows = [...records];

  // 1. WHERE Filter
  if (whereFilter) {
    const { field, operator, value } = whereFilter;
    rows = rows.filter((r) => {
      const val = r[field];
      if (operator === '==') return val === value;
      if (operator === '!=') return val !== value;
      if (operator === '>=') return val >= value;
      if (operator === '<=') return val <= value;
      if (operator === 'contains') return String(val).includes(String(value));
      return true;
    });
  }

  // 2. ORDER BY
  if (orderBy) {
    const { field, direction } = orderBy;
    const dir = direction === 'DESC' ? -1 : 1;
    rows.sort((a, b) => {
      if (a[field] < b[field]) return -1 * dir;
      if (a[field] > b[field]) return 1 * dir;
      return 0;
    });
  }

  // 3. LIMIT
  if (limit !== undefined && limit !== null) {
    rows = rows.slice(0, limit);
  }

  // 4. SELECT Projection
  return rows.map((r) => {
    const projected = {};
    for (const f of selectFields) {
      if (f in r) projected[f] = r[f];
    }
    return projected;
  });
}
`,
      typescript: `function executeSqlQuery(
  records: Record<string, any>[],
  selectFields: string[],
  whereFilter?: { field: string; operator: string; value: any },
  orderBy?: { field: string; direction: 'ASC' | 'DESC' },
  limit?: number
): Record<string, any>[] {
  let rows = [...records];

  if (whereFilter) {
    const { field, operator, value } = whereFilter;
    rows = rows.filter((r) => {
      const val = r[field];
      if (operator === '==') return val === value;
      if (operator === '!=') return val !== value;
      if (operator === '>=') return val >= value;
      if (operator === '<=') return val <= value;
      if (operator === 'contains') return String(val).includes(String(value));
      return true;
    });
  }

  if (orderBy) {
    const { field, direction } = orderBy;
    const dir = direction === 'DESC' ? -1 : 1;
    rows.sort((a, b) => {
      if (a[field] < b[field]) return -1 * dir;
      if (a[field] > b[field]) return 1 * dir;
      return 0;
    });
  }

  if (limit !== undefined && limit !== null) {
    rows = rows.slice(0, limit);
  }

  return rows.map((r) => {
    const projected: Record<string, any> = {};
    for (const f of selectFields) {
      if (f in r) projected[f] = r[f];
    }
    return projected;
  });
}
`,
      python: `def executeSqlQuery(records: list[dict], selectFields: list[str], whereFilter: dict = None, orderBy: dict = None, limit: int = None) -> list[dict]:
    rows = list(records)
    if whereFilter:
        f, op, v = whereFilter['field'], whereFilter['operator'], whereFilter['value']
        if op == '==':
            rows = [r for r in rows if r.get(f) == v]
        elif op == '!=':
            rows = [r for r in rows if r.get(f) != v]
        elif op == '>=':
            rows = [r for r in rows if r.get(f) >= v]
        elif op == '<=':
            rows = [r for r in rows if r.get(f) <= v]
        elif op == 'contains':
            rows = [r for r in rows if str(v) in str(r.get(f, ''))]

    if orderBy:
        f = orderBy['field']
        rev = orderBy.get('direction', 'ASC') == 'DESC'
        rows.sort(key=lambda r: r.get(f), reverse=rev)

    if limit is not None:
        rows = rows[:limit]

    return [{f: r[f] for f in selectFields if f in r} for r in rows]
`,
      cpp: `#include <vector>
#include <string>
#include <map>
using namespace std;
// C++ prototype stub
`,
      java: `import java.util.*;
// Java prototype stub
`,
      go: `package main
// Go prototype stub
`,
    },
    testCases: [
      {
        id: 'sql-1',
        input: 'records = [{id: 1, name: "Alice", age: 30}, {id: 2, name: "Bob", age: 24}, {id: 3, name: "Charlie", age: 35}], selectFields = ["name", "age"], whereFilter = {field: "age", operator: ">=", value: 30}, orderBy = {field: "age", direction: "DESC"}',
        expectedOutput: '[{"name": "Charlie", "age": 35}, {"name": "Alice", "age": 30}]',
        rawInput: [
          [
            { id: 1, name: 'Alice', age: 30 },
            { id: 2, name: 'Bob', age: 24 },
            { id: 3, name: 'Charlie', age: 35 },
          ],
          ['name', 'age'],
          { field: 'age', operator: '>=', value: 30 },
          { field: 'age', direction: 'DESC' },
        ],
        rawExpected: [
          { name: 'Charlie', age: 35 },
          { name: 'Alice', age: 30 },
        ],
      },
    ],
  },
  {
    id: 'relational-join-aggregator',
    title: '2. Relational Inner Join & Group Aggregator',
    difficulty: 'Medium',
    category: 'Database & SQL / Data Engineering',
    trackId: 'data_sql',
    timeEstimateMinutes: 20,
    description: `Perform an **INNER JOIN** and aggregate calculation across two relational datasets.

Given:
- \`users\`: \`[{ id: number, name: string }]\`
- \`orders\`: \`[{ id: number, userId: number, amount: number }]\`

Return an array of objects \`[{ name: string, totalSpent: number, orderCount: number }]\` for each user who has at least one order, sorted by **totalSpent DESC** (or name ASC if totalSpent is equal).`,
    examples: [
      {
        input: 'users = [{id: 1, name: "Alice"}, {id: 2, name: "Bob"}], orders = [{id: 101, userId: 1, amount: 50}, {id: 102, userId: 1, amount: 70}, {id: 103, userId: 2, amount: 30}]',
        output: '[{"name": "Alice", "totalSpent": 120, "orderCount": 2}, {"name": "Bob", "totalSpent": 30, "orderCount": 1}]',
      },
    ],
    constraints: [
      '1 <= users.length <= 1000',
      '0 <= orders.length <= 5000',
    ],
    functionName: 'innerJoinAggregate',
    starterCode: {
      javascript: `/**
 * @param {Array<{id: number, name: string}>} users
 * @param {Array<{id: number, userId: number, amount: number}>} orders
 * @return {Array<{name: string, totalSpent: number, orderCount: number}>}
 */
function innerJoinAggregate(users, orders) {
  const userMap = new Map();
  for (const u of users) {
    userMap.set(u.id, u.name);
  }

  const aggregates = new Map();
  for (const o of orders) {
    if (userMap.has(o.userId)) {
      const name = userMap.get(o.userId);
      if (!aggregates.has(name)) {
        aggregates.set(name, { name, totalSpent: 0, orderCount: 0 });
      }
      const agg = aggregates.get(name);
      agg.totalSpent += o.amount;
      agg.orderCount += 1;
    }
  }

  const res = Array.from(aggregates.values());
  res.sort((a, b) => {
    if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent;
    return a.name.localeCompare(b.name);
  });

  return res;
}
`,
      typescript: `function innerJoinAggregate(
  users: { id: number; name: string }[],
  orders: { id: number; userId: number; amount: number }[]
): { name: string; totalSpent: number; orderCount: number }[] {
  const userMap = new Map<number, string>();
  for (const u of users) userMap.set(u.id, u.name);

  const aggregates = new Map<string, { name: string; totalSpent: number; orderCount: number }>();
  for (const o of orders) {
    if (userMap.has(o.userId)) {
      const name = userMap.get(o.userId)!;
      if (!aggregates.has(name)) {
        aggregates.set(name, { name, totalSpent: 0, orderCount: 0 });
      }
      const agg = aggregates.get(name)!;
      agg.totalSpent += o.amount;
      agg.orderCount += 1;
    }
  }

  const res = Array.from(aggregates.values());
  res.sort((a, b) => {
    if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent;
    return a.name.localeCompare(b.name);
  });
  return res;
}
`,
      python: `def innerJoinAggregate(users: list[dict], orders: list[dict]) -> list[dict]:
    user_map = {u['id']: u['name'] for u in users}
    aggs = {}
    for o in orders:
        uid = o['userId']
        if uid in user_map:
            name = user_map[uid]
            if name not in aggs:
                aggs[name] = {"name": name, "totalSpent": 0, "orderCount": 0}
            aggs[name]["totalSpent"] += o["amount"]
            aggs[name]["orderCount"] += 1

    res = list(aggs.values())
    res.sort(key=lambda x: (-x["totalSpent"], x["name"]))
    return res
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
        id: 'join-1',
        input: 'users = [{id: 1, name: "Alice"}, {id: 2, name: "Bob"}], orders = [{id: 101, userId: 1, amount: 50}, {id: 102, userId: 1, amount: 70}, {id: 103, userId: 2, amount: 30}]',
        expectedOutput: '[{"name": "Alice", "totalSpent": 120, "orderCount": 2}, {"name": "Bob", "totalSpent": 30, "orderCount": 1}]',
        rawInput: [
          [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ],
          [
            { id: 101, userId: 1, amount: 50 },
            { id: 102, userId: 1, amount: 70 },
            { id: 103, userId: 2, amount: 30 },
          ],
        ],
        rawExpected: [
          { name: 'Alice', totalSpent: 120, orderCount: 2 },
          { name: 'Bob', totalSpent: 30, orderCount: 1 },
        ],
      },
    ],
  },
  {
    id: 'timeseries-sessionizer',
    title: '3. Time-Series Event Sessionizer',
    difficulty: 'Medium',
    category: 'Database & SQL / Data Engineering',
    trackId: 'data_sql',
    timeEstimateMinutes: 20,
    description: `Implement the sessionization algorithm used in web analytics pipelines (e.g., Google Analytics).

Given an array of user interaction events \`events = [{ userId: string, timestampSec: number }]\` and an \`inactivityTimeoutSec\`:
1. Group events by \`userId\` and sort them in chronological order.
2. An active session continues as long as subsequent events occur within \`<= inactivityTimeoutSec\` of the prior event. If the gap exceeds the timeout, a new session starts.
3. Compute for each user: \`{ userId: string, sessionCount: number }\`.
4. Return array sorted by \`userId\` alphabetically.`,
    examples: [
      {
        input: 'events = [{userId: "u1", timestampSec: 100}, {userId: "u1", timestampSec: 150}, {userId: "u1", timestampSec: 500}], inactivityTimeoutSec = 100',
        output: '[{"userId": "u1", "sessionCount": 2}]',
        explanation: 'Event at 100 and 150 (gap 50 <= 100) are session 1. Event at 500 (gap 350 > 100) begins session 2.',
      },
    ],
    constraints: [
      '1 <= events.length <= 10^4',
      'inactivityTimeoutSec >= 1',
    ],
    functionName: 'sessionizeEvents',
    starterCode: {
      javascript: `/**
 * @param {Array<{userId: string, timestampSec: number}>} events
 * @param {number} inactivityTimeoutSec
 * @return {Array<{userId: string, sessionCount: number}>}
 */
function sessionizeEvents(events, inactivityTimeoutSec) {
  const userEvents = new Map();
  for (const e of events) {
    if (!userEvents.has(e.userId)) userEvents.set(e.userId, []);
    userEvents.get(e.userId).push(e.timestampSec);
  }

  const results = [];
  for (const [userId, timestamps] of userEvents.entries()) {
    timestamps.sort((a, b) => a - b);
    let sessions = 1;
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] - timestamps[i - 1] > inactivityTimeoutSec) {
        sessions++;
      }
    }
    results.push({ userId, sessionCount: sessions });
  }

  results.sort((a, b) => a.userId.localeCompare(b.userId));
  return results;
}
`,
      typescript: `function sessionizeEvents(
  events: { userId: string; timestampSec: number }[],
  inactivityTimeoutSec: number
): { userId: string; sessionCount: number }[] {
  const userEvents = new Map<string, number[]>();
  for (const e of events) {
    if (!userEvents.has(e.userId)) userEvents.set(e.userId, []);
    userEvents.get(e.userId)!.push(e.timestampSec);
  }

  const results: { userId: string; sessionCount: number }[] = [];
  for (const [userId, timestamps] of userEvents.entries()) {
    timestamps.sort((a, b) => a - b);
    let sessions = 1;
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] - timestamps[i - 1] > inactivityTimeoutSec) {
        sessions++;
      }
    }
    results.push({ userId, sessionCount: sessions });
  }

  results.sort((a, b) => a.userId.localeCompare(b.userId));
  return results;
}
`,
      python: `def sessionizeEvents(events: list[dict], inactivityTimeoutSec: int) -> list[dict]:
    from collections import defaultdict
    user_events = defaultdict(list)
    for e in events:
        user_events[e['userId']].append(e['timestampSec'])

    results = []
    for uid, timestamps in user_events.items():
        timestamps.sort()
        sessions = 1
        for i in range(1, len(timestamps)):
            if timestamps[i] - timestamps[i-1] > inactivityTimeoutSec:
                sessions += 1
        results.append({"userId": uid, "sessionCount": sessions})

    results.sort(key=lambda x: x["userId"])
    return results
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
        id: 'sess-1',
        input: 'events = [{userId: "u1", timestampSec: 100}, {userId: "u1", timestampSec: 150}, {userId: "u1", timestampSec: 500}], inactivityTimeoutSec = 100',
        expectedOutput: '[{"userId": "u1", "sessionCount": 2}]',
        rawInput: [
          [
            { userId: 'u1', timestampSec: 100 },
            { userId: 'u1', timestampSec: 150 },
            { userId: 'u1', timestampSec: 500 },
          ],
          100,
        ],
        rawExpected: [{ userId: 'u1', sessionCount: 2 }],
      },
    ],
  },
  {
    id: 'tabular-pivot-table',
    title: '4. Dynamic Tabular Pivot Table Transformer',
    difficulty: 'Medium',
    category: 'Database & SQL / Data Engineering',
    trackId: 'data_sql',
    timeEstimateMinutes: 20,
    description: `Implement a dynamic **Pivot Table** transformation commonly used in BI engines (Tableau, Looker).

Given an array of records \`data = [{ rowKey: string, colKey: string, value: number }]\`:
1. Aggregate the sum of \`value\` for each unique \`(rowKey, colKey)\` pair.
2. Return an array of pivoted rows: \`[{ rowKey: "...", col1: val1, col2: val2, ..., total: sumOfAllCols }]\`.
3. Sort pivoted rows alphabetically by \`rowKey\`. If a cell has no entries, default to \`0\`.`,
    examples: [
      {
        input: 'data = [{rowKey: "North", colKey: "Q1", value: 100}, {rowKey: "North", colKey: "Q2", value: 150}, {rowKey: "South", colKey: "Q1", value: 80}]',
        output: '[{"rowKey": "North", "Q1": 100, "Q2": 150, "total": 250}, {"rowKey": "South", "Q1": 80, "Q2": 0, "total": 80}]',
      },
    ],
    constraints: [
      '1 <= data.length <= 1000',
      'rowKey and colKey are non-empty strings',
    ],
    functionName: 'pivotTable',
    starterCode: {
      javascript: `/**
 * @param {Array<{rowKey: string, colKey: string, value: number}>} data
 * @return {Array<Object>}
 */
function pivotTable(data) {
  const colSet = new Set();
  const rowMap = new Map();

  for (const item of data) {
    colSet.add(item.colKey);
    if (!rowMap.has(item.rowKey)) {
      rowMap.set(item.rowKey, {});
    }
    const row = rowMap.get(item.rowKey);
    row[item.colKey] = (row[item.colKey] || 0) + item.value;
  }

  const sortedCols = Array.from(colSet).sort();
  const sortedRowKeys = Array.from(rowMap.keys()).sort();

  return sortedRowKeys.map((rKey) => {
    const rawRow = rowMap.get(rKey);
    const rowObj = { rowKey: rKey };
    let total = 0;
    for (const col of sortedCols) {
      const val = rawRow[col] || 0;
      rowObj[col] = val;
      total += val;
    }
    rowObj.total = total;
    return rowObj;
  });
}
`,
      typescript: `function pivotTable(
  data: { rowKey: string; colKey: string; value: number }[]
): Record<string, any>[] {
  const colSet = new Set<string>();
  const rowMap = new Map<string, Record<string, number>>();

  for (const item of data) {
    colSet.add(item.colKey);
    if (!rowMap.has(item.rowKey)) rowMap.set(item.rowKey, {});
    const row = rowMap.get(item.rowKey)!;
    row[item.colKey] = (row[item.colKey] || 0) + item.value;
  }

  const sortedCols = Array.from(colSet).sort();
  const sortedRowKeys = Array.from(rowMap.keys()).sort();

  return sortedRowKeys.map((rKey) => {
    const rawRow = rowMap.get(rKey)!;
    const rowObj: Record<string, any> = { rowKey: rKey };
    let total = 0;
    for (const col of sortedCols) {
      const val = rawRow[col] || 0;
      rowObj[col] = val;
      total += val;
    }
    rowObj.total = total;
    return rowObj;
  });
}
`,
      python: `def pivotTable(data: list[dict]) -> list[dict]:
    from collections import defaultdict
    cols = sorted(list(set(d['colKey'] for d in data)))
    row_map = defaultdict(lambda: defaultdict(int))
    for d in data:
        row_map[d['rowKey']][d['colKey']] += d['value']

    res = []
    for r_key in sorted(row_map.keys()):
        obj = {"rowKey": r_key}
        total = 0
        for col in cols:
            val = row_map[r_key][col]
            obj[col] = val
            total += val
        obj["total"] = total
        res.append(obj)
    return res
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
        id: 'piv-1',
        input: 'data = [{rowKey: "North", colKey: "Q1", value: 100}, {rowKey: "North", colKey: "Q2", value: 150}, {rowKey: "South", colKey: "Q1", value: 80}]',
        expectedOutput: '[{"rowKey": "North", "Q1": 100, "Q2": 150, "total": 250}, {"rowKey": "South", "Q1": 80, "Q2": 0, "total": 80}]',
        rawInput: [
          [
            { rowKey: 'North', colKey: 'Q1', value: 100 },
            { rowKey: 'North', colKey: 'Q2', value: 150 },
            { rowKey: 'South', colKey: 'Q1', value: 80 },
          ],
        ],
        rawExpected: [
          { rowKey: 'North', Q1: 100, Q2: 150, total: 250 },
          { rowKey: 'South', Q1: 80, Q2: 0, total: 80 },
        ],
      },
    ],
  },
];
