import dotenv from "dotenv";
import { getLogFilePath } from "./lib/getLogPath";
import { TailPolling } from "./lib/watcher/tail";
import { resolve } from "path";
dotenv.config();


const writePath = resolve(__dirname, "data", "logCopy.log");


const tail = new TailPolling(getLogFilePath(), writePath);
setInterval(() => {
    try {
        tail.poll();
    } catch (e) {
        console.log(e)
    }
}, 100);
/* import { App } from "./app";
import { logParser } from "./lib/log-parser";


const port = process.env.PORT;
const main = async () => {

    //readNewData()
    if (!port) {
        return Promise.reject("Error: No port provided");
    }
    const parsedLog = await logParser();
    const application = new App(parsedLog);
    await application.init(port);
    console.log(`\x1b[36mServer runnig on \x1b[33m http://localhost:${port} \n\x1b[0m`);
}

main().catch((err) => {
    console.log(err);
});

process.on("uncaughtException", err => {
    console.log(err);
    process.exit(1);
}); */

