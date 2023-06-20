import type { User } from '@prisma/client';

declare global {
	namespace App {
		interface Locals {
			user: User;
		}
	}
}
