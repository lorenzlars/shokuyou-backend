import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ListResponseDto } from '../dto/listResponse.dto';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ApiListResponse = <TModel extends Type>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ListResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ListResponseDto) },
          {
            properties: {
              content: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
            required: ['content'],
          },
        ],
      },
    }),
  );
};
