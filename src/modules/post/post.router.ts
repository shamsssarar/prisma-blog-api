import express, { NextFunction } from "express";
import { PostController } from "./post.controller";
import { Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

router.post("/", auth(UserRole.USER), PostController.createPost);
router.get("/", auth(UserRole.USER), PostController.getAllPosts);
router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts
);
router.get("/:id", PostController.getSinglePost);
router.put("/:id", PostController.updatePost);
router.delete("/:id", PostController.deletePost);
router.delete("/", PostController.deleteAllPosts);

export const postRouter = router;
