import { CustomMessage } from "../custom-message";
import { MessageParser } from "./messageparser";

export class GreToClientMessageParser
    implements MessageParser<Record<string, unknown>>{
    //matches literal
    private readonly MATCH_REGEX = /GreToClientEvent/;
    public static MESSAGE_TYPE: string = "GreToClientEvent";
    public readonly USER_ID_REGEX = /\bMatch to ([A-Z0-9]+):/;
    private currentUserId: string = "";

    public match(line: string) {
        const match = this.MATCH_REGEX.test(line);
        return match;
    }

    public parseUserId(line: string) {
        //Parse userID from line before json
        const match = line.match(this.USER_ID_REGEX);
        this.currentUserId = match && match[1] || "";

    }

    public getMessage(line: string, matchId: string | null): CustomMessage<Record<string, unknown>> | null {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line);
                const userMatchId = this.currentUserId;
                this.currentUserId = "";
                return {
                    type: GreToClientMessageParser.MESSAGE_TYPE,
                    name: GreToClientMessageParser.MESSAGE_TYPE,
                    message,
                    belongsToMatch: matchId !== null,
                    matchId: matchId,
                    userMatchId
                }
            } catch (e) {
                console.log(e);
            }
        }
        return null;
    }
}
