export enum MatchStates {
    ARCHIVED = -1,
    PICK_PHASE = 0,
    READY_PHASE = 1,
    PLAY_PHASE = 2,
    WAITING_FOR_MATCH_LINK = 3,
    WARMUPS = 4,
    ROLLING_PHASE = 5,
    ROLL_WINNER_SELECTION = 6,
    BAN_PHASE = 7,
    WINNER_FOUND = 8,
    MATCH_CLOSED = 9,
    NOT_STARTED = 10
}

export const matchStates: { [key: number]: string } = {
    [MatchStates.ARCHIVED]: 'Archived',
    [MatchStates.PICK_PHASE]: 'Pick Phase',
    [MatchStates.READY_PHASE]: 'Ready Phase',
    [MatchStates.PLAY_PHASE]: 'Play Phase',
    [MatchStates.WAITING_FOR_MATCH_LINK]: 'Waiting for Match Link',
    [MatchStates.WARMUPS]: 'Warmups',
    [MatchStates.ROLLING_PHASE]: 'Rolling Phase',
    [MatchStates.ROLL_WINNER_SELECTION]: 'Roll Winner Selection',
    [MatchStates.BAN_PHASE]: 'Ban Phase',
    [MatchStates.WINNER_FOUND]: 'Winner Found',
    [MatchStates.MATCH_CLOSED]: 'Match Closed',
    [MatchStates.NOT_STARTED]: 'Not Started',
}

