# Industrial Blog App API 🏭

A robust backend API designed for an industrial blogging platform. This project handles data management for users, blog posts, and categories using **Prisma ORM** and **Node.js**.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js (or Next.js API Routes - *update this based on your code*)
* **ORM:** Prisma
* **Database:** PostgreSQL (e.g., NeonDB)
* **Language:** JavaScript / TypeScript

## ✨ Features

* **User Management:** Register and login functionality.
* **CRUD Operations:** Create, Read, Update, and Delete industrial blog posts.
* **Filtering:** Filter posts by category or industry sector.
* **Database Management:** Type-safe database queries with Prisma.

---

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/industrial-blog-app.git](https://github.com/your-username/industrial-blog-app.git)
cd industrial-blog-app
```
### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```typescript
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
PORT=3000
```

### 4. Setup Database (Prisma)
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push
```

### 5. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```
