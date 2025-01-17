import { DataSource, FindOptionsWhere } from 'typeorm';
import { DynamicModule, Inject, Module } from '@nestjs/common';
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

type PaginationFilter<T> = {
  options: PaginationOptions;
  where: FindOptionsWhere<T>;
};

type PaginationReturn<T> = Omit<PaginationOptions, 'filter'> & {
  total: number;
  content: T[];
};

export interface PaginatedRepository<T> extends Repository<T> {
  paginate(filter: PaginationFilter<T>): Promise<PaginationReturn<T>>;
}

function createOrderQuery(filter: PaginationOptions) {
  const order: any = {};

  if (filter.orderBy) {
    order[filter.orderBy] = filter.sortOrder;

    return order;
  }

  order.name = PaginationSortOrder.DESC;

  return order;
}

@Module({})
export class PaginatedRepositoryModule {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static forFeature(entities: Function[]): DynamicModule {
    const providers = entities.map((entity) => ({
      provide: `${entity.name}PaginatedRepository`,
      useFactory: (dataSource: DataSource) => {
        const repository = dataSource.getRepository(entity);

        return repository.extend({
          async paginate(
            filter: PaginationFilter<unknown>,
          ): Promise<PaginationReturn<unknown>> {
            const [content, total] = await this.findAndCount({
              order: createOrderQuery(filter.options),
              skip: (filter.options.page - 1) * filter.options.pageSize,
              take: filter.options.pageSize,
              where: filter.where,
            });

            return {
              ...filter.options,
              content,
              total,
            };
          },
        });
      },
      inject: [DataSource],
    }));

    return {
      module: PaginatedRepositoryModule,
      providers: providers,
      exports: providers,
    };
  }
}

export function InjectPaginatedRepository<T>(entity: {
  new (): T;
}): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    Inject(`${entity.name}PaginatedRepository`)(
      target,
      propertyKey,
      parameterIndex,
    );
  };
}
