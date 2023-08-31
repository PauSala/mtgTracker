import { CustomMessage } from "../custom-message";
import { MessageParser } from "./messageparser";

export class ClientToMatchServiceMessageType_ClientToGREMessageParser
    implements MessageParser<Record<string, unknown>>{

    //TO-DO: maybe ClientToMatchServiceMessageType_ClientToGREUIMessage are relevant too, for now let's ignore it;

    //matches literal
    private readonly MATCH_REGEX = /ClientToMatchServiceMessageType_ClientToGREMessage/;

    private currentStringToParse = "";

    public match(line: string) {
        return this.MATCH_REGEX.test(line);
    }

    public getMessage(line: string, matchId: string | null): CustomMessage<Record<string, unknown>> | null {
        this.currentStringToParse += line;
        if (line[0] !== "}") {
            return null
        }
        const data = JSON.parse(this.currentStringToParse);
        this.currentStringToParse = "";

        return {
            name: "ClientToMatchServiceMessageType_ClientToGREMessage",
            type: "ClientToGREMessage",
            belongsToMatch: matchId !== null,
            matchId: matchId,
            message: data
        }
    }
}
