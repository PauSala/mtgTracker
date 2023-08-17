"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logReader = void 0;
const readline_1 = require("readline");
const fs_1 = require("fs");
const events_1 = require("events");
const path_1 = require("path");
const fromServerMessage_parser_1 = require("./lib/fromServerMessage.parser");
const fromClientMessage_parser_1 = require("./lib/fromClientMessage.parser");
const clientToMatchServiceMessageType_ClientToGREMessage_parser_1 = require("./lib/clientToMatchServiceMessageType_ClientToGREMessage.parser");
const greToClientEvent_parser_1 = require("./lib/greToClientEvent.parser");
const logReader = () => __awaiter(void 0, void 0, void 0, function* () {
    const path = (0, path_1.resolve)(__dirname, "data", "Player.log");
    const objects = [];
    let isReadingFromServerMessage = false;
    let isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
    let isReadingGreToClientMessageParser = false;
    let unparsedLines = "";
    const rl = (0, readline_1.createInterface)({
        input: (0, fs_1.createReadStream)(path),
        crlfDelay: Infinity
    });
    const fromServerMessageParser = new fromServerMessage_parser_1.FromServerMessageParser();
    const fromClientMessageParser = new fromClientMessage_parser_1.FromClientMessageParser();
    const clientToMatchServiceMessageType_ClientToGREMessageParser = new clientToMatchServiceMessageType_ClientToGREMessage_parser_1.ClientToMatchServiceMessageType_ClientToGREMessageParser();
    const greToClientMessageParser = new greToClientEvent_parser_1.GreToClientMessageParser();
    rl.on('line', (line) => {
        if (fromServerMessageParser.match(line)) {
            const message = fromServerMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
            }
            return;
        }
        if (fromClientMessageParser.match(line)) {
            isReadingFromServerMessage = true;
            return;
        }
        if (isReadingFromServerMessage) {
            const message = fromClientMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
            }
            isReadingFromServerMessage = false;
            return;
        }
        if (greToClientMessageParser.match(line)) {
            isReadingGreToClientMessageParser = true;
            return;
        }
        if (isReadingGreToClientMessageParser) {
            const message = greToClientMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
            }
            isReadingGreToClientMessageParser = false;
            return;
        }
        if (clientToMatchServiceMessageType_ClientToGREMessageParser.match(line)) {
            isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = true;
            return;
        }
        if (isReadingClientToMatchServiceMessageType_ClientToGREMessageParser) {
            const message = clientToMatchServiceMessageType_ClientToGREMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
                isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
            }
            return;
        }
        if (line.length) {
            (0, fs_1.appendFile)((0, path_1.resolve)(__dirname, "data", "trash.log"), `${line}\n`, () => void 0);
        }
    });
    yield (0, events_1.once)(rl, 'close');
    console.log(unparsedLines);
    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return objects;
});
exports.logReader = logReader;
//# sourceMappingURL=log-reader.js.map