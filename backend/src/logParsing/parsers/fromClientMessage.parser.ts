import { CustomMessage } from "../custom-message";
import { MessageParser } from "./messageparser";

export class FromClientMessageParser
    implements MessageParser<Record<string, unknown>> {

    //matches literal prefix
    private readonly IS_MESSAGE_FROM_CLIENT_REGEX = /<== /;

    //matches until json start, therefore, next char index is the JSON start
    private readonly PREFIX_BEFORE_UUID = /<== [^(]*/;

    public static readonly MESSAGE_TYPE = "fromClientMessage";
    private currentMessageName: string = "";

    public match(line: string) {
        const match = this.IS_MESSAGE_FROM_CLIENT_REGEX.test(line);
        if (match) {
            const beforeUuid = this.PREFIX_BEFORE_UUID.exec(line)?.pop();
            if (beforeUuid) {
                this.currentMessageName = beforeUuid.replace(this.IS_MESSAGE_FROM_CLIENT_REGEX, "");
            }
        }
        return match;
    }

    public getMessage(line: string, matchId: string | null): CustomMessage<Record<string, unknown>> | null {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line);
                return {
                    name: this.currentMessageName,
                    type: FromClientMessageParser.MESSAGE_TYPE,
                    belongsToMatch: matchId !== null,
                    matchId: matchId,
                    message
                }
            } catch (e) {
                console.log(e);
            }
        }
        return null;
    }
}
