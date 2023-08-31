import { CustomMessage } from "../custom-message";
import { MessageParser } from "./messageparser";

export class GreToClientMessageParser
    implements MessageParser<Record<string, unknown>>{
    //matches literal
    private readonly MATCH_REGEX = /GreToClientEvent/;

    private messageType: string = "GreToClientEvent";

    public match(line: string) {
        const match = this.MATCH_REGEX.test(line);
        return match;
    }

    public getMessage(line: string, matchId: string | null): CustomMessage<Record<string, unknown>> | null {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line);
                return {
                    type: this.messageType,
                    name: this.messageType,
                    message,
                    belongsToMatch: matchId !== null,
                    matchId: matchId,
                }
            } catch (e) {
                console.log(e);
            }
        }
        return null;
    }
}
