import { Role } from '@prisma/client';
import { validations } from '../constants';
import { SetMetadata } from '@nestjs/common';

const role_keys = validations.rolesKey;
export const role = (...roles: Role[]) => SetMetadata(role_keys, roles);
