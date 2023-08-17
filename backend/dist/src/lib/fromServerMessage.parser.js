"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromServerMessageParser = void 0;
class FromServerMessageParser {
    constructor() {
        //matches literal prefix
        this.IS_MESSAGE_FROM_SERVER_REGEX = /\[UnityCrossThreadLogger\]==> /;
        //matches until json start, therefore, next char index is the JSON start
        this.PREFIX_BEFORE_JSON_REGEX = /\[UnityCrossThreadLogger\]==>[^\{]*/;
    }
    match(line) {
        return this.IS_MESSAGE_FROM_SERVER_REGEX.test(line);
    }
    getMessage(line) {
        const match = this.PREFIX_BEFORE_JSON_REGEX.exec(line);
        if (match === null || match === void 0 ? void 0 : match.length) {
            try {
                const message = JSON.parse(line.slice(match[0].length));
                const type = match[0].replace(this.IS_MESSAGE_FROM_SERVER_REGEX, "").trim();
                return {
                    type,
                    message: this.parseRequest(message)
                };
            }
            catch (e) {
                console.log(e);
            }
        }
        return null;
    }
    parseRequest(message) {
        try {
            if ('request' in message) {
                message.request = JSON.parse(message.request);
                if ('Payload' in message.request) {
                    message.request.Payload =
                        JSON.parse(message.request.Payload);
                }
            }
            return message;
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.FromServerMessageParser = FromServerMessageParser;
//# sourceMappingURL=fromServerMessage.parser.js.map