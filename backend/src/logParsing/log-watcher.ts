
import { createInterface } from "readline";
import { createReadStream, existsSync, statSync } from "fs";
import EventEmitter, { once } from "events";
import { LineParser } from "./line-parser";
import { CustomMessage } from "./custom-message";
import { LinePolling } from "./line-polling";
import { getLogFilePath } from "./get-log-path";
import { emitOnFileChange } from "./emit-on-file-change";
import { Queue } from "./queue";
import { DeckMessageHandler } from "../decks/decks-message-handler";
import { DeckRepositoryMongoDB } from "../decks/deckMongoModel";
import { MessageHandler } from "./message-handler";
//import { Tail } from "tail";


export class LogWatcher {

    private fileChangedEmitter = new EventEmitter();
    private readonly POLLING_TIMEOUT = 1000;
    private messageHandler = new MessageHandler();

    constructor(private path: string, private lineParser: LineParser) { }

    async init() {
        //const tail = new Tail(this.path, { fromBeginning: true, follow: true });
        emitOnFileChange(this.path, this.fileChangedEmitter);
        await this.parseLogFromStart();
        let line = this.lineParser.next();
        while (line) {
            await this.messageHandler.handleMessage(line);
            line = this.lineParser.next();
        }
        console.log("\nEnd line by line processing");
        this.lineParser.resetState();
        this.parseLineByLine(statSync(this.path).size);

    }

    private async parseLogFromStart() {

        if (!existsSync(this.path)) {
            return new Queue<CustomMessage<Record<string, unknown>>>().toArray();
        }
        const rl = createInterface(
            {
                input: createReadStream(this.path),
                crlfDelay: Infinity
            }
        );
        rl.on("line", (line) => {
            this.lineParser.parseLine(line);
        });
        await once(rl, "close");
        console.log("Reading log line by line done");
    }

    private parseLineByLine(bytesReaded: number) {

        const linePolling = new LinePolling(getLogFilePath(), bytesReaded);
        const pollingInterval = setInterval(() => {
            try {
                linePolling.poll();
            } catch (e) {
                console.log(e)
            }
        }, this.POLLING_TIMEOUT);

        linePolling.on("line", line => {
            try {
                this.lineParser.parseLine(line);
            } catch (e) {
                console.log("Unable to parse line", line);
            }

        });
        const fetchingInterval = setInterval(() => {
            const line = this.lineParser.next();
            if (line) {
                this.messageHandler.handleMessage(line);
            }
        }, 500);

        this.fileChangedEmitter.on("rename", () => {
            clearInterval(pollingInterval);
            clearInterval(fetchingInterval);
            this.parseLineByLine(0);
        });
    }
}
