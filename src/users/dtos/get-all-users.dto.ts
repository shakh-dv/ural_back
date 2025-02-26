import {User} from '@prisma/client';

export type GetAllUsersResultDTO = Omit<User, 'password'>[];
