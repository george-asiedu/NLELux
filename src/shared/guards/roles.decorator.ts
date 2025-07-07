import { Role } from '@prisma/client';
import { privileges } from '../utils/constants';
import { SetMetadata } from '@nestjs/common';

const role_keys: string = privileges.rolesKey;
export const role = (...roles: Role[]) => SetMetadata(role_keys, roles);
