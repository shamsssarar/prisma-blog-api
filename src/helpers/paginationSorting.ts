type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: string;
    sortBy?: string;
}

type IOptionsResult = {
    page: number;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const offset = (page - 1) * limit

    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: string = options.sortOrder || "asc";
    return {
        page,
        limit,
        offset,
        sortBy,
        sortOrder
    }
}

export default paginationSortingHelper;