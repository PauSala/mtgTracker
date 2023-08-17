"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientToMatchServiceMessageType_ClientToGREMessageParser = void 0;
class ClientToMatchServiceMessageType_ClientToGREMessageParser {
    constructor() {
        //TO-DO: maybe ClientToMatchServiceMessageType_ClientToGREUIMessage are relevant too, for now let's ignore it;
        //matches literal
        this.MATCH_REGEX = /ClientToMatchServiceMessageType_ClientToGREMessage/;
        this.currentStringToParse = "";
    }
    match(line) {
        return this.MATCH_REGEX.test(line);
    }
    getMessage(line) {
        this.currentStringToParse += line;
        if (line[0] !== "}") {
            return null;
        }
        const data = JSON.parse(this.currentStringToParse);
        this.currentStringToParse = "";
        return {
            type: "ClientToMatchServiceMessageType_ClientToGREMessage",
            message: data
        };
    }
}
exports.ClientToMatchServiceMessageType_ClientToGREMessageParser = ClientToMatchServiceMessageType_ClientToGREMessageParser;
//# sourceMappingURL=clientToMatchServiceMessageType_ClientToGREMessage.parser.js.map