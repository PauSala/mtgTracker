import EventEmitter from "events";
import { accessSync, constants, createReadStream, statSync } from "fs";

export class Tail extends EventEmitter {
    private internalDispatcher = new EventEmitter();
    private queue: { start: number, end: number }[] = [];
    private flushAtEOF = false;
    private filename: string = "";
    private buffer: string = "";
    private separator = /[\r]{0,1}\n/;
    private currentCursorPos: number = 0;

    constructor(path: string) {
        super();
        this.filename = path;
        try {
            accessSync(this.filename, constants.F_OK);
        } catch (err) {
            console.log(err)
        }
        this.internalDispatcher.on("next", () => {
            this.readBlock();
        });
        this.init();
    }

    readBlock() {
        if (this.queue.length >= 1) {
            const block = this.queue[0];
            if (block.end > block.start) {
                const stream = createReadStream(this.filename, { start: block.start, end: block.end - 1, encoding: "utf-8" });
                stream.on("error", (error) => {
                    console.log("tailError")
                    this.emit("error", error);
                });
                stream.on("end", () => {
                    this.queue.shift();
                    if (this.queue.length > 0) {
                        this.internalDispatcher.emit("next");
                    }
                    if (this.flushAtEOF && this.buffer.length > 0) {
                        this.emit("line", this.buffer);
                        this.buffer = "";
                    }
                    console.log("End!----------------------------------------")
                });
                stream.on("data", (d) => {
                    if (this.separator === null) {
                        this.emit("line", d);
                    } else {
                        this.buffer += d;
                        const parts = this.buffer?.split(this.separator);
                        this.buffer = parts.pop() || "";
                        for (const chunk of parts) {
                            this.emit("line", chunk);
                        }
                    }
                });
            }
        }
    }


    init() {
        const p = this.latestPosition()
        if (p < this.currentCursorPos) {//scenario where text is not appended but it's actually a w+
            this.currentCursorPos = p
        } else if (p > this.currentCursorPos) {
            this.queue.push({ start: this.currentCursorPos, end: p });
            this.currentCursorPos = p
            if (this.queue.length == 1) {
                this.internalDispatcher.emit("next");
            }
        }
    }


    latestPosition() {
        try {
            return statSync(this.filename).size;
        } catch (err) {
            console.error(`size check for ${this.filename} failed: ${err}`);
            this.emit("error", `size check for ${this.filename} failed: ${err}`);
            throw err;
        }
    }
}
