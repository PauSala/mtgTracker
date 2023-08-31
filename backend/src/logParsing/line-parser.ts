import { appendFile } from "fs";
import { CustomMessage } from "./custom-message";
import { resolve } from "path";
import { Queue } from "./queue";
import { ClientToMatchServiceMessageType_ClientToGREMessageParser } from "./parsers/clientToMatchServiceMessageType_ClientToGREMessage.parser";
import { FromClientMessageParser } from "./parsers/fromClientMessage.parser";
import { FromServerMessageParser } from "./parsers/fromServerMessage.parser";
import { GreToClientMessageParser } from "./parsers/greToClientEvent.parser";
import { MatchGameRoomStateChangedEventMessageParser } from "./parsers/matchGameRoomStateChangedEventMessage.parser";

export class LineParser {

    constructor(private store: Queue<CustomMessage<Record<string, unknown>>>) { }

    private isReadingFromClientMessage = false;
    private isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
    private isReadingGreToClientMessageParser = false;
    private isReadingMatchGameRoomStateChangedEventMessageParser = false;
    private currentMatchId: string | null = null;

    //parsers
    private fromServerMessageParser = new FromServerMessageParser();
    private fromClientMessageParser = new FromClientMessageParser();
    private greToClientMessageParser = new GreToClientMessageParser();
    private clientToMatchServiceMessageType_ClientToGREMessageParser = new ClientToMatchServiceMessageType_ClientToGREMessageParser();
    private matchGameRoomStateChangedEventMessageParser = new MatchGameRoomStateChangedEventMessageParser();


    async parseLine(line: string) {


        if (this.fromServerMessageParser.match(line)) {
            const message = this.fromServerMessageParser.getMessage(line, this.currentMatchId);
            if (message) {
                this.store.enqueue(message);
            }
            return
        }
        if (this.fromClientMessageParser.match(line)) {
            this.isReadingFromClientMessage = true;
            return
        }
        if (this.isReadingFromClientMessage) {
            const message = this.fromClientMessageParser.getMessage(line, this.currentMatchId);
            if (message) {
                this.store.enqueue(message);
            }
            this.isReadingFromClientMessage = false;
            return;
        }
        if (this.greToClientMessageParser.match(line)) {
            this.isReadingGreToClientMessageParser = true;
            return
        }
        if (this.isReadingGreToClientMessageParser) {
            const message = this.greToClientMessageParser.getMessage(line, this.currentMatchId);
            if (message) {
                this.store.enqueue(message);
            }
            this.isReadingGreToClientMessageParser = false;
            return;
        }
        if (this.clientToMatchServiceMessageType_ClientToGREMessageParser.match(line)) {
            this.isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = true;
            return;
        }
        if (this.isReadingClientToMatchServiceMessageType_ClientToGREMessageParser) {
            const message = this.clientToMatchServiceMessageType_ClientToGREMessageParser.getMessage(line, this.currentMatchId);
            if (message) {
                this.store.enqueue(message);
                this.isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
            }
            return
        }
        if (this.matchGameRoomStateChangedEventMessageParser.match(line)) {
            this.isReadingMatchGameRoomStateChangedEventMessageParser = true;
            return;
        }
        if (this.isReadingMatchGameRoomStateChangedEventMessageParser) {
            const message = this.matchGameRoomStateChangedEventMessageParser.getMessage(line, null);
            if (message) {
                if (message.message.matchGameRoomStateChangedEvent.gameRoomInfo.stateType === "MatchGameRoomStateType_Playing") {
                    this.currentMatchId = message.message.matchGameRoomStateChangedEvent.gameRoomInfo.gameRoomConfig.matchId;
                } else if (message.message.matchGameRoomStateChangedEvent.gameRoomInfo.stateType === "MatchGameRoomStateType_MatchCompleted") {
                    this.currentMatchId = null;
                }
                this.store.enqueue(message);
            }
            this.isReadingMatchGameRoomStateChangedEventMessageParser = false;
            return;
        }
        if (line.length) {
            appendFile(resolve(__dirname, "..", "data", "trash.log"), `${line}\n`, () => void 0);
        }
    }

    resetState() {
        this.store = new Queue();
        this.isReadingFromClientMessage = false;
        this.isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
        this.isReadingGreToClientMessageParser = false;
        this.isReadingMatchGameRoomStateChangedEventMessageParser = false;
        this.currentMatchId = null;
    }

    getAllLines() {
        return this.store.toArray();
    }

    dequeueLine() {
        return this.store.dequeue();
    }
}
