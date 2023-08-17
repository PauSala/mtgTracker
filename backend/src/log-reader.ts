import { createInterface } from "readline";
import { createReadStream } from "fs";
import { once } from "events";
import { resolve } from "path";
import { FromServerMessageParser } from "./lib/fromServerMessage.parser";
import { CustomMessage } from "./lib/types";
import { FromClientMessageParser } from "./lib/fromClientMessage.parser";
import { ClientToMatchServiceMessageType_ClientToGREMessageParser } from "./lib/clientToMatchServiceMessageType_ClientToGREMessage.parser";

export const logReader = async () => {
    
    const path = resolve(__dirname,  "data", "Player.log");
    const objects: CustomMessage[] = [];
    let currentLine = -1;
    let isReadingMultilineJson = false;
    let currentMultilineObject = "";
    let isReadingFromServerMessage = false;
    let isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;

    const rl = createInterface(
        {
            input: createReadStream(path),
            crlfDelay: Infinity
        }
    );

    const fromServerMessageParser = new FromServerMessageParser();
    const fromClientMessageParser = new FromClientMessageParser();
    const clientToMatchServiceMessageType_ClientToGREMessageParser = new ClientToMatchServiceMessageType_ClientToGREMessageParser();

    rl.on('line', (line) => {
        currentLine++;
        if(fromServerMessageParser.match(line)){
            const message = fromServerMessageParser.getMessage(line);
            if(message){
                objects.push(message);
            }
            return
        }
        if(fromClientMessageParser.match(line)){
            isReadingFromServerMessage = true;
            return
        }
        if(isReadingFromServerMessage){
            const message = fromClientMessageParser.getMessage(line);
            if(message){
                objects.push(message);
            }
            isReadingFromServerMessage = false;
            return;
        }
        if(clientToMatchServiceMessageType_ClientToGREMessageParser.match(line)){
            isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = true;
            return;
        }
        if(isReadingClientToMatchServiceMessageType_ClientToGREMessageParser){
            const message = clientToMatchServiceMessageType_ClientToGREMessageParser.getMessage(line);
            if(message){
                objects.push(message);
                isReadingClientToMatchServiceMessageType_ClientToGREMessageParser = false;
            }
            return
        }
/*         
        const firstChar = line[0];
        if(isReadingMultilineJson){
            currentMultilineObject += line;
        }
        if(isReadingMultilineJson && firstChar === "}"){
            isReadingMultilineJson = false;
            objects.push(JSON.parse(currentMultilineObject));
            currentMultilineObject = "";
        }
        if(firstChar === "{" && line.length > 1){
            const object = JSON.parse(line);
            objects.push(object);
        }else if(firstChar === "{" && line.length === 1){
            isReadingMultilineJson = true;
            currentMultilineObject += firstChar;
        } */
    });

    await once(rl, 'close');

    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return objects;
}
