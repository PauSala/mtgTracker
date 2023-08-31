import fs from "fs";
import { EventEmitter } from "stream";
const fsp = fs.promises;

export class LinePolling extends EventEmitter {

    private readonly EOL_REGEX = /\r\n|\r|\n/g;
    private readonly EOL_CLEAN_REGEX = /\r/g;
    private readonly BUFFER_SIZE = 65536;
    private buffer: Buffer;
    private processing = false;
    private bytesReaded = 0;
    private currentLine = "";
    private CRLF_active = false;

    constructor(private path: string, bytesReaded: number) {
        super();
        this.buffer = Buffer.alloc(this.BUFFER_SIZE);
        this.bytesReaded = bytesReaded;
    }

    async poll() {
        if (this.processing) {
            return;
        }
        this.processing = true;
        const filehandle = await fsp.open(this.path, "r")
            .catch(e => {
                console.log("Error opening file: ", e);
                this.processing = false;
            });

        if (!filehandle) {
            return;
        }

        const fileReadResult = await filehandle
            .read(this.buffer, 0, this.BUFFER_SIZE, this.bytesReaded)
            .catch(e => console.log("Error reading file: ", e));

        if (!fileReadResult) {
            return;
        }

        if (fileReadResult?.bytesRead === 0) {
            await filehandle.close();
            this.processing = false;
            return;
        }

        const batchLoaded = fileReadResult.buffer.toString("utf-8", 0, fileReadResult.bytesRead);
        this.processLines(batchLoaded);
        this.bytesReaded += fileReadResult.bytesRead;
        await filehandle.close().catch(e => console.log("Error closing file: ", e));
        this.processing = false;

    }

    processLines(input: string) {

        input = this.handleEOL(input);
        const combinedData = this.currentLine + input;
        const lines = combinedData.split(this.EOL_REGEX);

        // The last item is an incomplete line, store it for the next batch
        const last = lines[lines.length - 1];
        this.currentLine = last || "";
        lines.pop();

        for (const line of lines) {
            this.emit("line", line);
        }
    }

    handleEOL(input: string) {

        if (input.slice(-1) === "\r") {
            this.CRLF_active = true;
        }
        else if (input.charAt(0) === "\n" && this.CRLF_active) {
            input = input.replace(/\n/g, "");
            this.CRLF_active = false;
        }
        else {
            input = input.replace(this.EOL_CLEAN_REGEX, "");
        }
        return input;
    }
}
