import { CustomMessage } from "./types";

export class FromClientMessageParser {

    //matches literal prefix
    private readonly IS_MESSAGE_FROM_CLIENT_REGEX = /<== /;

    //matches until json start, therefore, next char index is the JSON start
    private readonly PREFIX_BEFORE_UUID = /<== [^\(]*/;

    private currentMessageType: string = "";

    public match(line: string) {
        const match = this.IS_MESSAGE_FROM_CLIENT_REGEX.test(line);
        if (match) {
            const beforeUuid = this.PREFIX_BEFORE_UUID.exec(line)?.pop();
            if (beforeUuid) {
                this.currentMessageType = beforeUuid.replace(this.IS_MESSAGE_FROM_CLIENT_REGEX, "");
            }
        }
        return match;
    }

    public getMessage(line: string): CustomMessage | null {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line);
                return {
                    type: this.currentMessageType,
                    message
                }
            } catch (e) {
                console.log(e);
            }
        }
        return null;
    }
}