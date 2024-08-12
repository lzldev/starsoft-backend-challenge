import { ArgumentMetadata, HttpException, PipeTransform } from '@nestjs/common';

/**
 * Throws an HTTP Error if Request body is an Empty Object.
 *
 * Useful when Validating Partial<T> types.
 */
export class IgnoreEmptyObjectsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type === 'body' &&
      typeof value === 'object' &&
      value !== null &&
      Object.keys(value).length === 0
    ) {
      throw new HttpException('Empty Object', 400);
    }

    return value;
  }
}
