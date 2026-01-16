# Industrial Blog App API 🏭

A robust backend API designed for an industrial blogging platform. This project handles data management for users, blog posts, and categories using **Prisma ORM** and **Node.js**.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js 
* **ORM:** Prisma
* **Database:** PostgreSQL (e.g., NeonDB)
* **Language:** TypeScript

## ✨ Features

* **User Management:** Secure authentication system (Register/Login).
* **Industrial Blog Posts:** Full CRUD support for industry-specific articles.
* **Advanced Filtering & Sorting:**
    * Filter by industry sector or category.
    * Sort by date (Newest/Oldest) or popularity.
* **Optimized Pagination:** Server-side pagination to handle large datasets efficiently.
* **Interactive Comment System:**
    * **Multi-Comment Support:** Handle unlimited comments per blog post.
    * **Nested Replies:** Recursive threaded comments (Reddit-style) allowing users to reply directly to other comments.
* **Database Management:** Type-safe database queries using **Prisma ORM**.

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

## 🗄️ Database Model Highlight

To handle **Nested Replies**, the Comment model uses a self-relation in Prisma:

```prisma
model Comment {
  id        Int           @id @default(autoincrement())
  postId    Int
  post      Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  ParentId  Int?
  parent    Comment?      @relation("CommentToReplies", fields: [ParentId], references: [id], onDelete: Cascade)
  replies   Comment[]     @relation("CommentToReplies")
  status    CommentStatus @default(APPROVED)
  content   String        @db.Text
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@index([postId])
  @@index([authorId])
  @@map("comments")
}
```