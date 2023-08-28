
import fs from "fs";
import EventEmitter from "events";

export const emitOnFileChange = (path: string, eventEmitter: EventEmitter) => {
    fs.watch(path, (event) => {
        if (event === "change") {
            eventEmitter.emit("update");
        }
    });
}
