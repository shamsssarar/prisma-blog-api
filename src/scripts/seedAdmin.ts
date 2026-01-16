import { prisma } from "../lib/prisma";
import { UserRole } from "../modules/post/post.router";
import "dotenv/config";

async function seedAdmin() {
  // Implementation for seeding admin data
  try {
    console.log("Seeding admin data...");
    const adminData = {
      name: process.env.NAME,
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      role: UserRole.ADMIN,
    };

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });
    if (!existingAdmin) {
      const signUpAdmin = await fetch(
        "http://localhost:3000/api/auth/sign-up/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Origin": "http://localhost:3000",
          },
          body: JSON.stringify(adminData),
        }
      );
      if (signUpAdmin.ok) {
        await prisma.user.update({
          where: {
            email: adminData.email as string,
          },
          data: {
            emailVerified: true as boolean,
          },
        })
        console.log("Admin user created and email verified.");
      } else {
        throw new Error("Failed to create admin user");
      }
    } else {
      console.log("Admin user already exists. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding admin data:", error);
  }
}
seedAdmin();
