import type { 
	User,
	UserInTeam,
	Team, 
	TeamInMatch, 
	MapInMatch, 
	Match, 
	Mappool, 
	MapInPool, 
	Map,
	Round, 
	Tournament, 
	UsersHostingTournament 
} from '@prisma/client';

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
		type TeamWithMembersAndMatches = TeamWithMembers & { InBracketMatches: TeamInMatchWithMaps[] };
		type MapInPoolWithMap = MapInPool & { Map: Map };
		type RoundWithEverything = Round & {
			Match: MatchWithTeams[];
			mappool: Mappool & {
				Maps: MapInPoolWithMaps[];
			};
		};
		type FullyPopulatedTournament = Tournament & {
			Hosts: HostWithUser[];
			Teams: TeamWithMembers[];
			rounds: RoundWithEverything[];
		};
		type TeamInMatchWithMaps = TeamInMatch & {
			Bans: MapInMatch[];
			Picks: MapInMatch[];
			Wins: MapInMatch[];
			Team: db.TeamWithMembers;
		};
		type MatchWithTeams = Match & {
			Teams: TeamInMatchWithMaps[]
		};
	}

	declare type Item = import('svelte-dnd-action').Item;
	declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:consider'?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
			'on:finalize'?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		}
	}
}
