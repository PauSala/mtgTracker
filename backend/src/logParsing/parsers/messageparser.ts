import { CustomMessage } from "../custom-message";

export interface MessageParser<T extends Record<string, unknown>> {
    getMessage(line: string, matchId: string | null): CustomMessage<T> | null;
    match(line: string): boolean;
}
