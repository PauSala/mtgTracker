import dotenv from 'dotenv';
dotenv.config();
import { App } from "./app";
import { logReader } from './log-reader';

const port = process.env.PORT;
const main = async () => {
    if (!port) {
        return Promise.reject("Error: No port provided");
    }
    const response =  await logReader();
    const application = new App(response);
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

