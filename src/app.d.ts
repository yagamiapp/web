import type { User } from '@prisma/client';

declare global {
	namespace App {
		interface Locals {
			user: User;
		}
	}

	namespace db {
		type HostWithUser = UsersHostingTournament & { User: User };
		type UserInTeamWithUser = UserInTeam & { User: User };
		type TeamWithMembers = Team & { Members: UserInTeamWithUser[] };
		type MapInPoolWithMap = MapInPool & { Map: Map };
		type RoundWithEverything = Round & {
			Match: Match[];
			mappool: Mappool & {
				Maps: MapInPoolWithMaps[];
			};
		};
		type FullyPopulatedTournament = Tournament & {
			Hosts: HostWithUser[];
			Teams: TeamWithMembers[];
			rounds: RoundWithEverything[];
		};
	}
}
