# 🧠 Why Does a Function Lose Context?

In JavaScript, when you **access a method from an object** and store it in a variable, it **loses the object it belonged to** — so `this` becomes `undefined` or incorrect.

---

## 👨‍🏫 Simple Example Without Binding

```js
var person = {
  name: "Aaditya",
  sayHello: function () {
    console.log("Hello, my name is " + this.name);
  },
};

person.sayHello(); // ✅ prints: Hello, my name is Aaditya

var greet = person.sayHello;
greet(); // ❌ prints: Hello, my name is undefined
```

### ❓ Why?

When you do:

```js
var greet = person.sayHello;
```

You're **not calling it through `person` anymore** — you're just calling a regular function with no object. So `this.name` is `undefined`.

---

## ✅ Fix It with `bind`

```js
var greet = person.sayHello.bind(person);
greet(); // ✅ prints: Hello, my name is Aaditya
```

Now you're **locking `this` to `person`**, no matter how or where you call the function.

---

## 🔁 Applying to Your Case

In Node.js, `connection.connect()` also uses `this` internally to refer to the `connection` object.

So if you do:

```js
var connect = connection.connect;
connect(); // ❌ wrong `this`
```

You break it.

Instead:

```js
var connect = connection.connect.bind(connection);
connect(); // ✅ `this` is correct
```

---

## 🧪 Even Simpler Test

```js
function showThis() {
  console.log(this);
}

showThis(); // global or undefined (in strict mode)

var obj = { test: showThis };
obj.test(); // ✅ obj is `this`

var alias = obj.test;
alias(); // ❌ loses context
```

---

## 🧷 Summary

- In JavaScript, **`this` is dynamic**, based on **how a function is called**, not **where it's defined**.
- **Assigning a method to a variable detaches it from its object.**
- Use `.bind(obj)` to make sure `this` always points to `obj`.
