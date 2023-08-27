import dotenv from 'dotenv';
dotenv.config();
import { App } from "./app";
import { logParser } from './lib/log-parser';
import { createReadStream } from "fs";
import { resolve } from 'path';

/* const filePath = resolve(__dirname, "..", "..", "..", "..", "/home/pau/Games/magic-the-gathering-arena/dosdevices/c:/users/pau/AppData/LocalLow/Wizards Of The Coast/MTGA/Player.log");
console.log(filePath)
let bytesRead = 0;
function readNewData() {
    console.log("reading again...")
    const readStream = createReadStream(filePath, { encoding: 'utf8', start: bytesRead });

    readStream.on('data', (chunk) => {
        // Process each new chunk of data
        console.log('New data:', chunk);
        bytesRead += chunk.length;
    });

    readStream.on('end', () => {
        // No more data to read, wait and read again
        console.log("end", bytesRead)
        setTimeout(readNewData, 5000); // Adjust the delay as needed
    });

    readStream.on('error', (error) => {
        console.error('An error occurred:', error);
        // Wait and retry reading
        setTimeout(readNewData, 1000); // Adjust the delay as needed
    });
} */

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
});

