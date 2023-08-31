export type CustomMessage<T extends Record<string, unknown>> = {
    name: string;
    type: string;
    belongsToMatch: boolean;
    matchId: string | null;
    message: T;
}
