import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../dto/paginationResponse.dto';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ApiPaginatedResponse = <TModel extends Type>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponseDto, model),
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
