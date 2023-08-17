import { createInterface } from "readline";
import { createReadStream, appendFile } from "fs";
import { once } from "events";
import { resolve } from "path";
import { FromServerMessageParser } from "./lib/fromServerMessage.parser";
import { CustomMessage } from "./lib/types";
import { FromClientMessageParser } from "./lib/fromClientMessage.parser";
import { ClientToMatchServiceMessageType_ClientToGREMessageParser } from "./lib/clientToMatchServiceMessageType_ClientToGREMessage.parser";
import { GreToClientMessageParser } from "./lib/greToClientEvent.parser";

export const logReader = async () => {

    const path = resolve(__dirname, "data", "Player.log");
    const objects: CustomMessage[] = [];
    let isReadingFromServerMessage = false;
    let isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
    let isReadingGreToClientMessageParser = false;
    let unparsedLines = "";

    const rl = createInterface(
        {
            input: createReadStream(path),
            crlfDelay: Infinity
        }
    );

    const fromServerMessageParser = new FromServerMessageParser();
    const fromClientMessageParser = new FromClientMessageParser();
    const clientToMatchServiceMessageType_ClientToGREMessageParser = new ClientToMatchServiceMessageType_ClientToGREMessageParser();
    const greToClientMessageParser = new GreToClientMessageParser();

    rl.on('line', (line) => {

        if (fromServerMessageParser.match(line)) {
            const message = fromServerMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
            }
            return
        }
        if (fromClientMessageParser.match(line)) {
            isReadingFromServerMessage = true;
            return
        }
        if (isReadingFromServerMessage) {
            const message = fromClientMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
            }
            isReadingFromServerMessage = false;
            return;
        }
        if (greToClientMessageParser.match(line)) {
            isReadingGreToClientMessageParser = true;
            return
        }
        if (isReadingGreToClientMessageParser) {
            const message = greToClientMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
            }
            isReadingGreToClientMessageParser = false;
            return;
        }
        if (clientToMatchServiceMessageType_ClientToGREMessageParser.match(line)) {
            isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = true;
            return;
        }
        if (isReadingClientToMatchServiceMessageType_ClientToGREMessageParser) {
            const message = clientToMatchServiceMessageType_ClientToGREMessageParser.getMessage(line);
            if (message) {
                objects.push(message);
                isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
            }
            return
        }
        if(line.length){
            appendFile(resolve(__dirname, "data", "trash.log"),`${line}\n`, () => void 0)
        }

    });

    await once(rl, 'close');
    console.log(unparsedLines);
    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return objects;
}
