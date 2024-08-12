import { User } from '../user/entities/user.entity';

export type UserPayload = Pick<User, 'id' | 'username'>;

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  export namespace Express {
    export interface User extends UserPayload {}
  }
}
