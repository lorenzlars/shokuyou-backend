import { Model, Query, RootFilterQuery } from 'mongoose';

export enum PaginationSortOrder {
  ASC = 1,
  DESC = -1,
}

export type PaginationOptions = {
  page: number;
  pageSize: number;
  orderBy?: string;
  sortOrder?: PaginationSortOrder;
  filter?: string;
};

export type PaginationReturn<T> = Omit<PaginationOptions, 'filter'> & {
  total: number;
  content: T[];
};

export type PaginationFilter<T> = {
  options?: PaginationOptions;
  find?: RootFilterQuery<T>;
  callback?: (model: Query<unknown, T>) => void;
};

export function createOrderQuery(filter: PaginationOptions) {
  const order: any = {};

  if (filter.orderBy) {
    order[filter.orderBy] = filter.sortOrder;

    return order;
  }

  order.name = PaginationSortOrder.DESC;

  return order;
}

export async function paginatedFind<T>(
  model: Model<T>,
  filter: PaginationFilter<T>,
): Promise<PaginationReturn<T>> {
  const query = model.find(filter.find);

  if (filter.options) {
    query
      .sort(createOrderQuery(filter.options))
      .limit(filter.options.pageSize)
      .skip((filter.options.page - 1) * filter.options.pageSize);
  }

  if (filter.callback) {
    filter.callback(query);
  }

  const content = await query.exec();
  const total = await model.countDocuments().exec();

  return {
    ...filter.options,
    content: content.map((item) => item.toObject()),
    total,
  };
}
