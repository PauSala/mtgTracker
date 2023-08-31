
import { createInterface } from "readline";
import { createReadStream, existsSync } from "fs";
import EventEmitter, { once } from "events";
import { LineParser } from "./line-parser";
import { CustomMessage } from "./custom-message";
import { LinePolling } from "./line-polling";
import { getLogFilePath } from "./get-log-path";
//import { emitOnFileChange } from "./emit-on-file-change";
import { Queue } from "./queue";
import { Tail } from "tail";

export class LogWatcher {

    private fileChangedEmitter = new EventEmitter();
    private readonly POLLING_TIMEOUT = 1000;

    constructor(private path: string, private lineParser: LineParser) { }

    async init() {
        const tail = new Tail(this.path, { fromBeginning: true, follow: true });
        tail.on("line", (line) => console.log(line));
        /* emitOnFileChange(this.path, this.fileChangedEmitter);
        const parsedLog = await this.parseLogFromStart();
        const lines: (CustomMessage<Record<string, unknown>> | undefined)[] = [];
        parsedLog.forEach(() => {
            const line = this.lineParser.dequeueLine();
            lines.push(line);
        });
        console.log("\nEnd line by line processing");
        this.parseLineByLine(statSync(this.path).size); */

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
        return this.lineParser.getAllLines();
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
            this.lineParser.parseLine(line)
        });
        const fetchingInterval = setInterval(() => {
            const line = this.lineParser.dequeueLine();
            if (line) {
                console.log(line);
            }
        });

        this.fileChangedEmitter.on("rename", () => {
            clearInterval(pollingInterval);
            clearInterval(fetchingInterval);
            this.parseLineByLine(0);
        });
    }
}
