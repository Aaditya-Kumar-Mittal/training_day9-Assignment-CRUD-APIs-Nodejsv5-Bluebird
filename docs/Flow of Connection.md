# `getConnection()` and `connectAsync()`

## 🔧 `getConnection()`

- **Returns an active connection from the pool**.
- It uses `db.getConnectionAsync()` and **promisifies** the connection with Bluebird:

  ```js
  Bluebird.promisifyAll(connection);
  ```

- **You use this** when you want to:

  - Perform multiple queries within a **single connection/session**.
  - **Control transactions** (like `beginTransactionAsync`, `commitAsync`, `rollbackAsync`).
  - Keep the connection open across multiple queries (as in your credit wallet logic).

✅ **Your credit wallet function needs this.**

---

## 🔌 `connectAsync()`

- Used **just to test connectivity**.
- It gets a connection, prints a success message, and immediately **releases** it:

  ```js
  conn.release();
  ```

- No promisification, no reuse, no transactions — just checks if the DB is up.

🧪 It's useful for:

- Health checks.
- Initialization logs.
- Debugging connection issues.

---

## ✅ Why you're using `getConnection()` in your credit wallet code

Because you need to:

1. **Begin a transaction**: `conn.beginTransactionAsync()`
2. **Execute multiple queries in sequence**.
3. **Rollback** on failure.
4. **Commit** if all goes well.

These all need to happen within a **single, persistent database connection**, and that’s exactly what `getConnection()` gives you.

If you used `connectAsync()`, you'd:

- Get a connection.
- Release it immediately (so no further queries could use it).
- Not be able to use it for a transaction safely.

---

### 🧠 In Short

| Method            | Purpose                                  | Reuse Connection | Allows Transaction | Usage Scenario                 |
| ----------------- | ---------------------------------------- | ---------------- | ------------------ | ------------------------------ |
| `getConnection()` | Get and **use** a connection for queries | ✅ Yes           | ✅ Yes             | Wallet credit (your case)      |
| `connectAsync()`  | Only to **test** the connection          | ❌ No            | ❌ No              | Health check, setup validation |

---

## 🔄 The Problem with Your Current `connectAsync()`

Right now, your `connectAsync()`:

- Gets a connection.
- Prints a message.
- Releases it.
- **Does not return** the connection.
- **Does not promisify** it for transactional usage.

That makes it unusable for queries or transactions — it’s a one-off ping.

---

## ✅ How to Design a Unified Function

You can design a single method like this:

```js
getConnection: function (shouldTestOnly = false) {
  return db.getConnectionAsync()
    .then(function (connection) {
      if (shouldTestOnly) {
        console.log("Database connected successfully!");
        connection.release();
        return null; // Optional: to signal "no active connection returned"
      } else {
        Bluebird.promisifyAll(connection);
        return connection;
      }
    })
    .catch(function (error) {
      console.error("Error connecting to database: " + error);
      throw error;
    });
}
```

### 🔍 Usage Scenarios

#### ✅ Health Check

```js
dbController.getConnection(true);
```

#### ✅ Transaction or Query

```js
dbController.getConnection().then((conn) => {
  return conn.beginTransactionAsync(); // and so on...
});
```

---

## ⚠️ When Is It Not a Good Idea?

You **shouldn't combine them** if:

- You want strict separation between **"test" behavior** and **"functional" behavior** for safety or clarity.
- Different environments or tools call them (e.g., a health-check endpoint using `connectAsync()` independently of app logic).

---

## ✅ Recommendation

Combining the logic is fine **as long as the function clearly distinguishes** between:

- A **test-only connection** (just checking).
- A **live connection** for real use (promisified, transactional).

Your updated `getConnection()` above handles both without duplicating logic — so it’s a clean and DRY approach.

---

## 🔁 THE FLOW: What Happens When You Use `connectAsync`

### Here’s what your current `connectAsync` does

```js
connectAsync: function () {
  return db.getConnectionAsync()
    .then(function (conn) {
      console.log("Database connected successfully!");
      conn.release(); // 🚨 Important
    })
    .catch(function (error) {
      console.log("Error connecting to database: " + error);
    });
}
```

### 🔄 So when you call `connectAsync()`

1. It asks the DB pool: "Give me a connection."
2. The DB gives it a connection (`conn`).
3. It prints: ✅ “Database connected successfully!”
4. Then — **immediately** — it calls `conn.release()`.

   - This sends the connection **back to the pool**.

5. The connection is **not returned** to the calling function.
6. That means — 💡 **you can't use `conn` later** in the calling function.

---

## ❌ Why You Can’t Use `connectAsync()` in Your Wallet Logic

Your wallet logic **needs to use the same connection for multiple things**:

```js
conn.beginTransactionAsync() → conn.queryAsync() → conn.commitAsync()
```

So this is why it **uses `getConnection()`**:

```js
getConnection: function () {
  return db.getConnectionAsync().then(function (connection) {
    Bluebird.promisifyAll(connection); // 🚀 enables async functions like queryAsync
    return connection; // 💡 returns usable connection
  });
}
```

### 🔁 Wallet credit logic flow

1. `getConnection()` is called → gets and returns a connection.
2. That same connection is used for:

   - Starting a transaction
   - Reading wallet balance
   - Inserting/updating balance
   - Committing or rolling back

✔️ It works because `conn` is **persisted** and **not released immediately** like in `connectAsync()`.

---

## 🔍 But Then How Do Other Queries Work?

You're asking:

> If I only use `connectAsync()` to test connection, how are other queries working?

That's because those other queries **don’t call `connectAsync()`**.
Instead, they likely use `db.queryAsync(...)` — which under the hood:

- **Grabs a new connection from the pool**
- Executes a single query
- **Automatically releases the connection**

So in those cases, it’s fine to **not manage the connection manually**.

---

## 🔁 Summary: Flow Differences

| Feature                          | `connectAsync()`         | `getConnection()`                     |
| -------------------------------- | ------------------------ | ------------------------------------- |
| Purpose                          | Health check / test only | Persistent connection for real logic  |
| Returns usable connection?       | ❌ No                    | ✅ Yes                                |
| Promisified with Bluebird?       | ❌ No                    | ✅ Yes                                |
| Releases connection immediately? | ✅ Yes                   | ❌ No (you release it manually later) |
| Can be used in transactions?     | ❌ No                    | ✅ Yes                                |

---

## ✅ Final Takeaway

- `connectAsync()` is for **connectivity test only**, not for real query logic.
- `getConnection()` is for **actual logic that needs multiple operations or transactions**.
- Other single queries (`db.queryAsync(...)`) work independently because the DB library:

  - Opens a short-lived connection,
  - Runs the query,
  - Then **automatically closes** or returns it to the pool.

---
