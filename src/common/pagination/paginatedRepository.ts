import { DataSource } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import {
  createOrderQuery,
  PaginationFilter,
  PaginationReturn,
} from './paginatedFind';
import { DynamicModule, Inject, Module } from '@nestjs/common';

export interface PaginatedRepository<T> extends Repository<T> {
  paginate(filter: PaginationFilter<T>): Promise<PaginationReturn<T>>;
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
