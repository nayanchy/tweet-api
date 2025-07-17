import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/contants/constants';
import { Request } from 'express';
import { ActiveUserType } from '../interfaces/active-user-type.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserType | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUserType;

    return field ? user[field] : user;
  },
);
