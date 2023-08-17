import { CustomMessage } from "./types";

export class GreToClientMessageParser{
        //matches literal
        private readonly MATCH_REGEX = /GreToClientEvent/;

        private messageType: string = "GreToClientEvent";

        public match(line: string) {
            const match = this.MATCH_REGEX.test(line);
            return match;
        }
    
        public getMessage(line: string): CustomMessage | null {
            if (line[0] === "{") {
                try {
                    const message = JSON.parse(line);
                    return {
                        type: this.messageType,
                        message
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            return null;
        }
}
