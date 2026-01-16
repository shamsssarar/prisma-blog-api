import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSorting";
import { error } from "node:console";

const createPost = async function (req: Request, res: Response) {
  try {
    console.log(req.user);
    // Extract post data from the request body
    const result = await PostService.createPost(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
};

const getAllPosts = async function (req: Request, res: Response) {
  try {
    const { search } = req.query;
    // console.log("Search Params:", search);
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const statusResult = req.query.status
      ? (req.query.status as PostStatus)
      : undefined;
    const featured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const authorId = req.query.authorId
      ? (req.query.authorId as string)
      : undefined;

    const { page, limit, offset, sortBy, sortOrder } = paginationSortingHelper(
      req.query as any
    );

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
      status: statusResult,
      isFeatured: featured,
      authorId,
      page,
      limit,
      offset,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve posts" });
  }
};

const updatePost = async function (req: Request, res: Response) {
  const id = parseInt(req.params.id || "0");
  try {
    const result = await PostService.updatePost(id as number, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update post" });
  }
};

const getSinglePost = async function (req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const result = await PostService.getSinglePost(id as number);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve post" });
  }
};

const deletePost = async function (req: Request, res: Response) {
  const id = parseInt(req.params.id || "0");
  try {
    const result = await PostService.deletePost(id as number);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete post" });
  }
};

const deleteAllPosts = async function (req: Request, res: Response) {
  try {
    const result = await PostService.deleteAllPosts();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete all posts" });
  }
};

const getMyPosts = async function (req: Request, res: Response) {
  try {
    const authorId = req.user?.id;
    const result = await PostService.getMyPosts(authorId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve user's posts" });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
  updatePost,
  getSinglePost,
  deletePost,
  deleteAllPosts,
  getMyPosts,
};
