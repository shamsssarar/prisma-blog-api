import {
  CommentStatus,
  Post,
  PostStatus,
  Prisma,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPost = async function (data: Prisma.PostCreateInput) {
  const result = await prisma.post.create({ data });
  return result;
};

type getAllPostsPayload = {
  search?: string | undefined;
  tags?: string[] | undefined;
  status?: string | undefined;
  isFeatured?: boolean | undefined;
  authorId?: string | undefined;
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
};

const getAllPosts = async function (payload: getAllPostsPayload) {
  const andConditions: PostWhereInput[] = [];
  const searchStatus = payload.status
    ? (payload.status as string)
        .split(",")
        .map((s) => s.toUpperCase() as PostStatus)
    : undefined;
  const take = Number(payload.limit);
  const skip = Number(payload.offset);
  const sortBy = payload.sortBy as string;
  const sortOrder = payload.sortOrder as string;

  if (payload.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (payload.tags?.length) {
    andConditions.push({
      tags: { hasEvery: payload.tags as string[] },
    });
  }

  if (searchStatus?.length) {
    andConditions.push({
      status: { in: searchStatus as PostStatus[] },
    });
  }

  if (payload.isFeatured !== undefined) {
    andConditions.push({
      isFeatured: payload.isFeatured,
    });
  }

  if (payload.authorId) {
    andConditions.push({
      authorId: payload.authorId,
    });
  }

  const where = andConditions.length ? { AND: andConditions } : {};

  const results = await prisma.post.findMany({
    where,
    take,
    skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: results,
    pagination: {
      total,
      take,
      skip,
      totalPages: Math.ceil(total / take),
    },
  };
};

const updatePost = async function (id: number, data: Prisma.PostUpdateInput) {
  const result = await prisma.post.update({ where: { id }, data });
  return result;
};

const getSinglePost = async function (id: number) {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          where: {
            ParentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              include: {
                replies: true,
              },
            },
          },
        },
      },
    });
    return postData;
  });
};

const deletePost = async function (id: number) {
  const result = await prisma.post.delete({ where: { id } });
  return result;
};

const deleteAllPosts = async function () {
  const result = await prisma.post.deleteMany();
  return result;
};

const getMyPosts = async function (authorId: string) {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const PostService = {
  createPost,
  getAllPosts,
  updatePost,
  getSinglePost,
  deletePost,
  deleteAllPosts,
  getMyPosts,
};
