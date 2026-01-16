import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { string } from "better-auth/*";

const createComment = async function (req: Request, res: Response) {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
};

const getAllComments = async function (req: Request, res: Response) {
  try {
    const result = await commentService.getAllComments();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "failed to get all comments" });
  }
};

const getSingleComment = async function (req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const result = await commentService.getSingleComment(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve comment" });
  }
};

const getCommentByAuthorId = async function (req: Request, res: Response) {
  const id = req.params.id;
  try {
    const result = await commentService.getCommentByAuthorId(id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve comment" });
  }
};

const deleteComment = async function (req: Request, res: Response) {
  const id = parseInt(req.params.id || "0");
  try {
    const result = await commentService.deleteComment(id as number);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete comment" });
  }
};

export const commentController = {
  getAllComments,
  createComment,
  getSingleComment,
  getCommentByAuthorId,
  deleteComment,
};
