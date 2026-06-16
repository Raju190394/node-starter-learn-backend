export const paginate = async ({
  model,
  where,
  page = 1,
  limit = 20
}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit
    }),
    model.count({ where })
  ]);

  return {
    data,
    total,
    page,
    limit
  };
};

export const cursorPaginate = async ({
  model,
  where = {},
  cursor,
  limit = 20,
  orderBy = { id: "desc" },
  include = {}
}) => {
  const data = await model.findMany({
    where,
    take: Number(limit),
    orderBy,
    include,
    ...(cursor
      ? {
          cursor: {
            id: Number(cursor)
          },
          skip: 1
        }
      : {})
  });

  return {
    data,
    nextCursor:
      data.length > 0
        ? data[data.length - 1].id
        : null,
    hasMore: data.length === Number(limit)
  };
};