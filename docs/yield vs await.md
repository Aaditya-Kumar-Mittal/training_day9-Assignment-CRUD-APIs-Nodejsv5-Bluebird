# 🔄 `yield` vs `async/await` – Control Flow & Requirements

| Feature            | `yield`                                        | `async/await`                                       |
| ------------------ | ---------------------------------------------- | --------------------------------------------------- |
| Type               | Works inside **generator functions**           | Works inside **async functions**                    |
| Control            | Manual – you must call `.next()` to resume     | Automatic – resumes when `await`ed Promise resolves |
| Function Type      | `function*` (generator)                        | `async function`                                    |
| Returns            | A **generator object**                         | A **Promise**                                       |
| Use Case           | Custom iterators, co-routines, lazy evaluation | Asynchronous programming                            |
| Can Pause?         | ✅ Yes, pauses at each `yield`                 | ✅ Yes, pauses at each `await`                      |
| Resume Execution?  | ✅ Yes, using `.next()`                        | ✅ Yes, automatically by JS runtime                 |
| Requires Promises? | ❌ Not required (but can yield Promises)       | ✅ Yes, `await` works only with Promises            |

---

## ✅ 1. `yield` – Conditions for Control

### 📌 **Must be inside a generator function**

```js
function* myGen() {
  yield "Step 1";
  yield "Step 2";
}
```

### 📌 **Must use `.next()` to continue**

```js
const gen = myGen();
console.log(gen.next().value); // Step 1
console.log(gen.next().value); // Step 2
```

### 🔄 You control _when_ the function moves to the next step

---

## ✅ 2. `async/await` – Conditions for Control

### 📌 **Must be inside an `async` function**

```js
async function fetchData() {
  let data = await fetch("https://api.example.com");
}
```

### 📌 **Only works with Promises**

```js
await nonPromiseValue; // treated as `Promise.resolve(value)`
await someCallbackFunc(); // ❌ bad if not returning Promise
```

### ✅ Execution _pauses_ at `await` until the Promise resolves, then continues

---

## ⚖️ Comparison Table with Code Control

| Aspect          | `yield`                                   | `async/await`                                         |
| --------------- | ----------------------------------------- | ----------------------------------------------------- |
| Function Type   | `function*`                               | `async function`                                      |
| Syntax          | `yield`                                   | `await`                                               |
| What it Pauses? | Function execution, waiting for `.next()` | Function execution, waiting for a Promise             |
| How to Resume?  | Call `.next()` manually                   | JS engine resumes automatically when Promise resolves |
| Return Type     | Generator object                          | Promise                                               |
| Ideal For       | Lazy sequences, coroutines                | Asynchronous I/O, cleaner async code                  |

---

## 🎯 Example: Compare in Code

### 🔹 Using `yield` (Manual Control)

```js
function* steps() {
  yield "1️⃣ Step 1";
  yield "2️⃣ Step 2";
  yield "3️⃣ Step 3";
}

const flow = steps();

console.log(flow.next().value); // 1️⃣ Step 1
console.log(flow.next().value); // 2️⃣ Step 2
console.log(flow.next().value); // 3️⃣ Step 3
```

### 🔹 Using `async/await` (Async Control)

```js
async function asyncSteps() {
  console.log("1️⃣ Step 1");
  await delay(1000); // Simulates async delay
  console.log("2️⃣ Step 2");
  await delay(1000);
  console.log("3️⃣ Step 3");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

asyncSteps();
```

---

## 🧠 TL;DR – Key Differences

| Condition               | `yield`               | `await`                                   |
| ----------------------- | --------------------- | ----------------------------------------- |
| Needs special function? | ✅ `function*`        | ✅ `async function`                       |
| Pauses execution?       | ✅ Yes                | ✅ Yes                                    |
| Needs manual resume?    | ✅ Yes, via `.next()` | ❌ No, auto resume                        |
| Works with Promises?    | Optional              | Required                                  |
| Used For                | Iteration, coroutines | Async operations (like network, file I/O) |

---

## ✅ Final Definition (with Clarity)

### 🌀 `yield` – Pauses **until `.next()` is called again**

- It **pauses the generator function**, but **does NOT wait for an operation to complete**.
- You (or a library like `co` or Bluebird’s `coroutine`) must call `.next()` manually or automatically.

```js
function* gen() {
  console.log("Before yield");
  yield; // stops here
  console.log("After yield");
}

const g = gen();
g.next(); // "Before yield"
g.next(); // "After yield"
```

So `yield` **does not inherently wait** for anything — it just stops execution until you _manually continue_.

---

### ⏳ `await` – Pauses **until the Promise resolves**

- It **pauses the async function** and **automatically resumes** when the awaited Promise resolves.
- No need to manually call anything.

```js
async function fetchData() {
  console.log("Before await");
  await new Promise((res) => setTimeout(res, 1000));
  console.log("After await"); // Runs after 1 second
}
```

So `await` **waits for the operation to complete** before continuing execution.

---

## 🔍 TL;DR Version:

| Keyword | Pauses Execution? | Waits for Completion?             | How to Resume          |
| ------- | ----------------- | --------------------------------- | ---------------------- |
| `yield` | ✅ Yes            | ❌ No (until `.next()` is called) | Manually via `.next()` |
| `await` | ✅ Yes            | ✅ Yes (until Promise resolves)   | Automatically          |

---

### 🧠 Easy Analogy

- **`yield` is like hitting pause on a movie manually** — you need to press play again.
- **`await` is like buffering** — the movie resumes _automatically_ when enough data is loaded.

---
