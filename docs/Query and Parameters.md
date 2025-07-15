# 🎯 Query and Parameters

## 🔍 Key Differences: Query vs. Params

| Feature               | **Query Parameters**                    | **Route (URL) Parameters**         |
| --------------------- | --------------------------------------- | ---------------------------------- |
| **Location**          | After the `?` in the URL                | Embedded directly in the URL path  |
| **Syntax**            | `?key=value&key2=value2`                | `/users/:id/orders/:orderId`       |
| **Access in Express** | `req.query`                             | `req.params`                       |
| **Optionality**       | Often optional                          | Often required                     |
| **Use Case**          | Filtering, sorting, pagination, search  | Identifying a specific resource    |
| **Multiple Values**   | Easily support multiple key-value pairs | Usually fixed and defined in route |

---

### ✅ Query Parameters — `req.query`

**Used For:**

- Filtering
- Sorting
- Search terms
- Pagination

**URL Example:**

```api
GET /products?category=shoes&price=low
```

**Access in Express:**

```js
req.query.category; // "shoes"
req.query.price; // "low"
```

---

### ✅ Route Parameters — `req.params`

**Used For:**

- Identifying specific resources
- Required path elements (e.g., user ID, post ID)

**Route Definition:**

```js
app.get("/users/:userId/posts/:postId", (req, res) => {
  const userId = req.params.userId; // "101"
  const postId = req.params.postId; // "55"
});
```

**URL Example:**

```api
GET /users/101/posts/55
```

---

## 🧠 Mnemonic

- **Query = Questions** → You’re asking questions about the data.
  (What category? What page number?)
- **Params = Path** → These are part of the **path** to a specific item.

---

### ✅ Example Comparison

| Action                      | Route                 | Query               |
| --------------------------- | --------------------- | ------------------- |
| Get user by ID              | `/users/:id`          | N/A                 |
| Search users by name        | `/users?name=John`    | ✅ `req.query.name` |
| Get product by ID           | `/products/:id`       | ✅ `req.params.id`  |
| Filter products by category | `/products?cat=shoes` | ✅ `req.query.cat`  |

---
