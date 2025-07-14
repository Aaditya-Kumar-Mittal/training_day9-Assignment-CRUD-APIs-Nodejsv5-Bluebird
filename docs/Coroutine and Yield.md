# 🌀 Pehle: Ek Normal Function vs Generator Function

## 🔸 Normal Function

```js
function normalFunc() {
  console.log("A");
  console.log("B");
  console.log("C");
}

normalFunc();
```

### 🔁 Flow

```md
A ➡ B ➡ C — done
```

Control ek baar mein shuru se end tak chala jata hai.

---

## 🔄 Ab: Generator Function (`function*` + `yield`)

## 🔸 Generator Example

```js
function* myGen() {
  console.log("A");
  yield "pause1"; // 🔴 control yahan ruk jata hai
  console.log("B");
  yield "pause2"; // 🔴 fir se ruk jata hai
  console.log("C");
}

const gen = myGen();
console.log(gen.next().value); // A
console.log(gen.next().value); // B
console.log(gen.next().value); // C
```

### 🧠 Control Flow

| Step | What Happens                                                                         |
| ---- | ------------------------------------------------------------------------------------ |
| 1️⃣   | `myGen()` se generator object ban gaya                                               |
| 2️⃣   | `gen.next()` ne `console.log("A")` run kiya, fir `yield` pe ruk gaya                 |
| 3️⃣   | `gen.next()` dobara call kiya, toh `console.log("B")` chala, fir `yield` pe ruk gaya |
| 4️⃣   | Third `gen.next()` ne `console.log("C")` chalaya, and done                           |

---

## 🎯 Key Point

- `yield` ka matlab hai: **“Execution ko yahin pause karo, jab tak mujhe dobara resume na kiya jaye.”**
- `next()` call se hi control wapas function ke andar jata hai.

---

## 🔁 Ab: Bluebird + `coroutine` ke saath `yield` kaise kaam karta hai?

## 🔸 Coroutine Example in Node.js v5

```js
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

var readFiles = Promise.coroutine(function* () {
  console.log("➡ Reading File 1");
  const data1 = yield fs.readFileAsync("file1.txt", "utf8");

  console.log("➡ Reading File 2");
  const data2 = yield fs.readFileAsync("file2.txt", "utf8");

  console.log("✅ Done reading files");
});
```

### 🔁 Control Flow Samjho

```md
readFiles() ->
    ▶ Step 1: control enters coroutine
    ▶ Step 2: console.log("➡ Reading File 1")
    ▶ Step 3: yield fs.readFileAsync() → control wapas chala gaya event loop mein (promise wait karega)
    ▶ Step 4: jaise hi file read ho gaya → control wapas aaya function ke andar
    ▶ Step 5: console.log("➡ Reading File 2") → fir se yield → fir se pause
    ▶ Step 6: jaise hi doosra file read ho gaya → control aaya aur "✅ Done" print hua
```

### 🤯 Simple Line

> `yield` = control stop karo, result ka wait karo
> `coroutine` = tumhare liye promises ko manage karega

---

## 📊 Control Jump Visual (Imagine like this)

```js
readFiles() start
   |
   └──▶ console.log("➡ Reading File 1")
          |
          └──▶ yield (pause + wait for file1.txt)
                    |
                    ◀── file1.txt done
                         |
                         └──▶ console.log("➡ Reading File 2")
                                  |
                                  └──▶ yield (pause + wait for file2.txt)
                                            |
                                            ◀── file2.txt done
                                                 |
                                                 └──▶ console.log("✅ Done")
```

---

## 📌 In Simple Hinglish Summary

| Concept      | Meaning                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `function*`  | Special function jo pause ho sakti hai                                                                 |
| `yield`      | Execution ko yahan tak roko, baad mein continue karo                                                   |
| `gen.next()` | Execution ko resume karo jahan `yield` pe chhoda tha                                                   |
| `coroutine`  | Bluebird ka helper function jo generator ke `yield` aur promises ko line-by-line async kaam banata hai |

---

## 💡 Analogy

Socho `yield` waale function ek **Netflix series** jaise hai:

- Tumne ek episode (function part) dekh liya → pause (yield)
- Baad mein continue karte ho → next episode dekhte ho (gen.next())
- Pure season ek baar mein nahi chalta — ek-ek episode dekhte ho.

But **`coroutine`** se yeh hota hai ki Netflix tumhare liye automatically next episode start kar deta hai jaise hi pehla khatam ho jaye 😄
