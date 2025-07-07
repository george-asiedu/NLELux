import { Role } from '@prisma/client';
import { privileges } from '../constants';
import { SetMetadata } from '@nestjs/common';

const role_keys: string = privileges.rolesKey;
export const role = (...roles: Role[]) => SetMetadata(role_keys, roles);
