import express from "express";
import { auth, UserRole } from "../post/post.router";
import { commentController } from "./comment.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

router.get(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getAllComments
);

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getSingleComment
);

router.get(
  "/author/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentByAuthorId
);

router.delete("/:id", auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment);

export const commentRouter = router;
