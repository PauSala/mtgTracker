"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreToClientMessageParser = void 0;
class GreToClientMessageParser {
    constructor() {
        //matches literal
        this.MATCH_REGEX = /GreToClientEvent/;
        this.messageType = "GreToClientEvent";
    }
    match(line) {
        const match = this.MATCH_REGEX.test(line);
        return match;
    }
    getMessage(line) {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line);
                return {
                    type: this.messageType,
                    message
                };
            }
            catch (e) {
                console.log(e);
            }
        }
        return null;
    }
}
exports.GreToClientMessageParser = GreToClientMessageParser;
//# sourceMappingURL=greToClientEvent.parser.js.map