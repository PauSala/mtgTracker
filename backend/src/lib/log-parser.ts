import { createInterface } from "readline";
import { createReadStream, appendFile } from "fs";
import { once } from "events";
import { resolve } from "path";

import { CustomMessage } from "./types";

import { ClientToMatchServiceMessageType_ClientToGREMessageParser } from "./parsers/clientToMatchServiceMessageType_ClientToGREMessage.parser";
import { FromClientMessageParser } from "./parsers/fromClientMessage.parser";
import { FromServerMessageParser } from "./parsers/fromServerMessage.parser";
import { GreToClientMessageParser } from "./parsers/greToClientEvent.parser";
import { MatchGameRoomStateChangedEventMessageParser } from "./parsers/matchGameRoomStateChangedEventMessage.parser";


export const logParser = async () => {

    const path = resolve(__dirname, "..", "data", "Player.log");
    const objects: CustomMessage<Record<string, unknown>>[] = [];
    let isReadingFromClientMessage = false;
    let isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
    let isReadingGreToClientMessageParser = false;
    let isReadingMatchGameRoomStateChangedEventMessageParser = false;
    let unparsedLines = "";
    let currentMatchId: string | null = null;

    const rl = createInterface(
        {
            input: createReadStream(path),
            crlfDelay: Infinity
        }
    );

    const fromServerMessageParser = new FromServerMessageParser();
    const fromClientMessageParser = new FromClientMessageParser();
    const greToClientMessageParser = new GreToClientMessageParser();
    const clientToMatchServiceMessageType_ClientToGREMessageParser = new ClientToMatchServiceMessageType_ClientToGREMessageParser();
    const matchGameRoomStateChangedEventMessageParser = new MatchGameRoomStateChangedEventMessageParser();

    rl.on('line', (line) => {

        if (fromServerMessageParser.match(line)) {
            const message = fromServerMessageParser.getMessage(line, currentMatchId);
            if (message) {
                objects.push(message);
            }
            return
        }
        if (fromClientMessageParser.match(line)) {
            isReadingFromClientMessage = true;
            return
        }
        if (isReadingFromClientMessage) {
            const message = fromClientMessageParser.getMessage(line, currentMatchId);
            if (message) {
                objects.push(message);
            }
            isReadingFromClientMessage = false;
            return;
        }
        if (greToClientMessageParser.match(line)) {
            isReadingGreToClientMessageParser = true;
            return
        }
        if (isReadingGreToClientMessageParser) {
            const message = greToClientMessageParser.getMessage(line, currentMatchId);
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
            const message = clientToMatchServiceMessageType_ClientToGREMessageParser.getMessage(line, currentMatchId);
            if (message) {
                objects.push(message);
                isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
            }
            return
        }
        if(matchGameRoomStateChangedEventMessageParser.match(line)){
            isReadingMatchGameRoomStateChangedEventMessageParser = true;
            return;
        }
        if(isReadingMatchGameRoomStateChangedEventMessageParser){
            const message = matchGameRoomStateChangedEventMessageParser.getMessage(line, null);
            if(message){
                if(message.message.matchGameRoomStateChangedEvent.gameRoomInfo.stateType === "MatchGameRoomStateType_Playing"){
                    currentMatchId = message.message.matchGameRoomStateChangedEvent.gameRoomInfo.gameRoomConfig.matchId;
                }else if(message.message.matchGameRoomStateChangedEvent.gameRoomInfo.stateType === "MatchGameRoomStateType_MatchCompleted"){
                    currentMatchId = null;
                }
                objects.push(message);
            }
            isReadingMatchGameRoomStateChangedEventMessageParser = false;
            return;
        }
        if(line.length){
            appendFile(resolve(__dirname, "..", "data", "trash.log"),`${line}\n`, () => void 0)
        }

    });

    await once(rl, 'close');
    console.log(unparsedLines);
    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return objects;
}
