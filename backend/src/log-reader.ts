import { createInterface } from "readline";
import { createReadStream } from "fs";
import { once } from "events";
import { resolve } from "path";

export const logReader = async () => {
    
    const path = resolve(__dirname,  "data", "Player.log");
    const objects: unknown[] = [];
    let isReadingMultilineJson = false;
    let currentMultilineObject = "";

    const rl = createInterface(
        {
            input: createReadStream(path),
            crlfDelay: Infinity
        }
    );

    rl.on('line', (line) => {
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
        }
    });

    await once(rl, 'close');

    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return objects;
}
