import { UserRequest } from './user-request.interface';

export interface RequestWithUser extends UserRequest {
  user: UserRequest;
}
