"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromClientMessageParser = void 0;
class FromClientMessageParser {
    constructor() {
        //matches literal prefix
        this.IS_MESSAGE_FROM_CLIENT_REGEX = /<== /;
        //matches until json start, therefore, next char index is the JSON start
        this.PREFIX_BEFORE_UUID = /<== [^\(]*/;
        this.currentMessageType = "";
    }
    match(line) {
        var _a;
        const match = this.IS_MESSAGE_FROM_CLIENT_REGEX.test(line);
        if (match) {
            const beforeUuid = (_a = this.PREFIX_BEFORE_UUID.exec(line)) === null || _a === void 0 ? void 0 : _a.pop();
            if (beforeUuid) {
                this.currentMessageType = beforeUuid.replace(this.IS_MESSAGE_FROM_CLIENT_REGEX, "");
            }
        }
        return match;
    }
    getMessage(line) {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line);
                return {
                    type: this.currentMessageType,
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
exports.FromClientMessageParser = FromClientMessageParser;
//# sourceMappingURL=fromClientMessage.parser.js.map