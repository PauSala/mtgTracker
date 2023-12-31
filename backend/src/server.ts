import dotenv from "dotenv";
import { LogWatcher } from "./logParsing/log-watcher";
import { getLogFilePath } from "./logParsing/get-log-path";
import { LineParser } from "./logParsing/line-parser";
import { Queue } from "./logParsing/queue";
import { MongoDbConnection } from "./infrastructure/mongoDb/mongoDbConnection";
import { App } from "./app";
dotenv.config();


const port = process.env.PORT;
const main = async () => {

    //readNewData()
    if (!port) {
        return Promise.reject("Error: No port provided");
    }
    const mongoConnection = new MongoDbConnection();
    await mongoConnection.connect();
    const logWatcher = new LogWatcher(getLogFilePath(), new LineParser(new Queue()));
    logWatcher.init();
    const application = new App();
    await application.init(port);
    console.log(`\x1b[36mServer runnig on \x1b[33m http://localhost:${port} \n\x1b[0m`);
}

main().catch((err) => {
    console.log(err);
});

process.on("uncaughtException", err => {
    console.log(err);
    process.exit(1);
});

