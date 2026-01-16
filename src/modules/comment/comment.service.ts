import { prisma } from "../../lib/prisma";
import { Response } from "express";

const createComment = async function (payload: {
  content: string;
  authorId: string;
  postId: number;
  parentId?: number;
}) {
  try {
    await prisma.post.findUniqueOrThrow({
      where: {
        id: payload.postId,
      },
    });

    if (payload.parentId) {
      await prisma.comment.findFirstOrThrow({
        where: {
          id: payload.parentId,
        },
      });
    }

    return await prisma.comment.create({
      data: payload,
    });
  } catch (Error) {
    console.log(Error);
  }
  //   console.log("connected", payload);
};

const getAllComments = async function () {
  console.log("get connected");
};

const getSingleComment = async (id: number) => {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  //   console.log("hello");
};

const getCommentByAuthorId = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async function (id: number) {
  const result = await prisma.comment.delete({ where: { id } });
  return result;
};

export const commentService = {
  createComment,
  getAllComments,
  getSingleComment,
  getCommentByAuthorId,
  deleteComment,
};
