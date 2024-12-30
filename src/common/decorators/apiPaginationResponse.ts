import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../dto/pagination-response.dto';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponseDto, model),
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({ type: PaginationResponseDto<TModel> }),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              content: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
