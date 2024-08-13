import { User } from '../users/entities/user.entity';

export type UserPayload = Pick<User, 'id' | 'username'>;

/**
 * Declares the Express.User type used in the Express.Request object.
 */
declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  export namespace Express {
    export interface User extends UserPayload {}
  }
}
