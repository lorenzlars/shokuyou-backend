import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';

export enum PaginationSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type PaginationOptions = {
  page: number;
  pageSize: number;
  orderBy?: string;
  sortOrder?: PaginationSortOrder;
  filter?: string;
};

export type PaginationFilter<T> = {
  options: PaginationOptions;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  relations?: FindOptionsRelations<T> | string[];
};

export type PaginationReturn<T> = Omit<PaginationOptions, 'filter'> & {
  total: number;
  content: T[];
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
  repository: Repository<T>,
  filter: PaginationFilter<T>,
): Promise<PaginationReturn<T>> {
  const [content, total] = await repository.findAndCount({
    order: createOrderQuery(filter.options),
    skip: (filter.options.page - 1) * filter.options.pageSize,
    take: filter.options.pageSize,
    where: filter.where,
    relations: filter.relations,
  });

  return {
    ...filter.options,
    content,
    total,
  };
}
