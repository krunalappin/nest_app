import { SetMetadata } from '@nestjs/common';

export const SOMETHING_WENT_WRONG = `Something went wrong`;
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);