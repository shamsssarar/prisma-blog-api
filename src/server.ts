import { request } from "express";
import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 3000;
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    // Additional server startup logic can go here
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log(request.body);
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
