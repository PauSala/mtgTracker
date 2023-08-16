"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logReader = void 0;
const readline_1 = require("readline");
const fs_1 = require("fs");
const events_1 = require("events");
const path_1 = require("path");
const logReader = () => __awaiter(void 0, void 0, void 0, function* () {
    const path = (0, path_1.resolve)(__dirname, "data", "Player.log");
    const objects = [];
    let isReadingMultilineJson = false;
    let currentMultilineObject = "";
    const rl = (0, readline_1.createInterface)({
        input: (0, fs_1.createReadStream)(path),
        crlfDelay: Infinity
    });
    rl.on('line', (line) => {
        const firstChar = line[0];
        if (isReadingMultilineJson) {
            currentMultilineObject += line;
        }
        if (isReadingMultilineJson && firstChar === "}") {
            isReadingMultilineJson = false;
            objects.push(JSON.parse(currentMultilineObject));
            currentMultilineObject = "";
        }
        if (firstChar === "{" && line.length > 1) {
            const object = JSON.parse(line);
            objects.push(object);
        }
        else if (firstChar === "{" && line.length === 1) {
            isReadingMultilineJson = true;
            currentMultilineObject += firstChar;
        }
    });
    yield (0, events_1.once)(rl, 'close');
    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return objects;
});
exports.logReader = logReader;
//# sourceMappingURL=log-reader.js.map