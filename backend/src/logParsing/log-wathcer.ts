
import { createInterface } from "readline";
import { createReadStream, existsSync } from "fs";
import EventEmitter, { once } from "events";
import { LineParser } from "./line-parser";
import { CustomMessage } from "./custom-message";
import { LinePolling } from "./line-polling";
import { getLogFilePath } from "./get-log-path";
import { emitOnFileChange } from "./emit-on-file-change";
import { Queue } from "./queue";

export class LogWatcher {

    private fileChangedEmitter = new EventEmitter();
    private readonly POLLING_TIMEOUT = 1000;

    constructor(private path: string, private lineParser: LineParser) { }

    async init() {
        emitOnFileChange(this.path, this.fileChangedEmitter);
        const parsedLog = await this.parseLogFromStart();
        parsedLog.lines.forEach(() => {
            const line = this.lineParser.getLine();
            console.log(line);
        });
        console.log("\n\n\n\n\n\n\n\n\nEnd line by line processing");
        this.parseLineByLine(parsedLog.bytesRead);

    }

    private async parseLogFromStart() {
        let bytesRead = 0;

        if (!existsSync(this.path)) {
            return { lines: new Queue<CustomMessage<Record<string, unknown>>>().toArray(), bytesRead };
        }

        const rl = createInterface(
            {
                input: createReadStream(this.path),
                crlfDelay: Infinity
            }
        );

        rl.on("line", (line) => {
            bytesRead += Buffer.byteLength(line);
            this.lineParser.parseLine(line);
        });

        await once(rl, "close");
        console.log("Reading log line by line done");
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        return { lines: this.lineParser.getAllLines(), bytesRead };
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
            const line = this.lineParser.getLine();
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
