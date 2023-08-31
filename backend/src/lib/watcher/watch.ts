
import fs from "fs";
import EventEmitter from "events";

export const emitOnFileChange = (path: string, eventEmitter: EventEmitter) => {
    fs.watch(path, (event) => {
        if (event !== "change") {
            console.log(event)
        }
        if (event === "change") {
            eventEmitter.emit("update");
        }
        if (event === "rename") {
            eventEmitter.emit("rename");
        }
    });
}
