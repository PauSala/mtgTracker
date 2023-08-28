import fs from "fs";
const fsp = fs.promises;

export class TailPolling {

    private readonly EOL_REGEX = /\r\n|\r|\n/g;
    private readonly EOL_CLEAN_REGEX = /\r/g;
    private readonly BUFFER_SIZE = 10;
    private buffer: Buffer;
    private processing = false;
    private bytesReaded = 0;
    private currentLine = "";

    constructor(private path: string, private writePath: string) {
        this.buffer = Buffer.alloc(this.BUFFER_SIZE);
    }

    async poll() {
        if (this.processing) {
            return;
        }
        this.processing = true;
        const filehandle = await fsp.open(this.path, "r");
        const fileReadResult = await filehandle.read(this.buffer, 0, this.BUFFER_SIZE, this.bytesReaded);
        if (fileReadResult.bytesRead === 0) {
            console.log("fileReaded")
            await filehandle.close()
            return;
        }
        const batchLoaded = fileReadResult.buffer.toString("utf-8", 0, fileReadResult.bytesRead);
        this.processLines(batchLoaded);
        this.bytesReaded += fileReadResult.bytesRead;
        await filehandle.close();
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        /* 
                fs.open(this.path, (err: NodeJS.ErrnoException | null, fd: number) => {
                    if (err) {
                        console.error("Error opening file: ", err);
                        return;
                    }
        
                    fs.read(fd, this.buffer, 0, this.BUFFER_SIZE, this.bytesReaded, (err, _bytesRead, buffer) => {
        
                        if (err) {
                            this.closeFile(fd);
                            return;
                        }
                        if (_bytesRead === 0) {
                            console.log("fileReaded")
                            this.closeFile(fd);
                            return;
                        }
                        // Data read successfully
                        const batchLoaded = buffer.toString("utf-8", 0, _bytesRead);
                        this.getLines(batchLoaded);
                        this.bytesReaded += _bytesRead;
                        this.closeFile(fd);
                        const used = process.memoryUsage().heapUsed / 1024 / 1024;
                        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
                        return;
                    });
                }) */

    }

    processLines(newData: string) {

        //Replace \r character to avoid truncating a line break of type \r\n resulting in more lines than expected
        newData = newData.replace(this.EOL_CLEAN_REGEX, "");
        const combinedData = this.currentLine + newData;
        const lines = combinedData.split(this.EOL_REGEX);

        // If the last item is an incomplete line, store it for the next batch
        const last = lines[lines.length - 1];
        this.currentLine = last || "";
        if (this.currentLine !== "") {
            lines.pop();
        }

        // Join complete lines and write them to the output file
        const linesToWrite = lines.length
            && lines.join("\n");

        if (linesToWrite) {
            fs.appendFile(this.writePath, linesToWrite, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }


    closeFile(fd: number) {
        fs.close(fd, (err) => {
            if (err) {
                console.error("Error reading file: ", err);
            }
            this.processing = false;
        });
    }
}
