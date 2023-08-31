import { createInterface } from "readline";
import { createReadStream, existsSync } from "fs";
import { once } from "events";
import { LineParser } from "./line-parser";


export const parseLogFromStart = async (path: string, lineParser: LineParser) => {

    let bytesRead = 0;

    if (!existsSync(path)) {
        return { lines: [], bytesRead };
    }

    const rl = createInterface(
        {
            input: createReadStream(path),
            crlfDelay: Infinity
        }
    );

    rl.on("line", (line) => {
        bytesRead += Buffer.byteLength(line);
        lineParser.parseLine(line);
    });

    await once(rl, "close");
    console.log("Reading file line by line with readline done.");
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return { lines: lineParser.getLine(), bytesRead };
}
