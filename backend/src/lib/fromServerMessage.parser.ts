import { CustomMessage } from "./types";

export class FromServerMessageParser {

    //matches literal prefix
    private readonly IS_MESSAGE_FROM_SERVER_REGEX = /\[UnityCrossThreadLogger\]==> /;

    //matches until json start, therefore, next char index is the JSON start
    private readonly PREFIX_BEFORE_JSON_REGEX = /\[UnityCrossThreadLogger\]==>[^\{]*/;

    public match(line: string) {
        return this.IS_MESSAGE_FROM_SERVER_REGEX.test(line);
    }

    public getMessage(line: string): CustomMessage | null {
        const match = this.PREFIX_BEFORE_JSON_REGEX.exec(line);
        if (match?.length) {
            try {
                const message = JSON.parse(line.slice(match[0].length));
                const type = match[0].replace(this.IS_MESSAGE_FROM_SERVER_REGEX, "").trim();

                return {
                    type,
                    message: this.parseRequest(message)
                }

            } catch (e) {
                console.log(e);
                return null
            }
        }
        return null;
    }

    private parseRequest(message: Record<string, unknown>) {
        try {
            if ('request' in message) {
                message.request = JSON.parse(message.request as string);
                if ('Payload' in (message.request as Record<string, unknown>)) {
                    (message.request as Record<string, unknown>).Payload =
                        JSON.parse((message.request as Record<string, unknown>).Payload as string);
                }
            }
            return message

        } catch (e) {
            console.log(e);
        }
    }

}
