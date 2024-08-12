import { SetMetadata } from '@nestjs/common';

export const PUBLIC_METADATA_KEY = 'PUBLIC';

/**
 * Use to Define a Public Route , Opting out of Auth
 */
export const Public = (value = true) => SetMetadata(PUBLIC_METADATA_KEY, value);
