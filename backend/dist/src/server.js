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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const log_reader_1 = require("./log-reader");
const port = process.env.PORT;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!port) {
        return Promise.reject("Error: No port provided");
    }
    const response = yield (0, log_reader_1.logReader)();
    const application = new app_1.App(response);
    yield application.init(port);
    console.log(`\x1b[36mServer runnig on \x1b[33m http://localhost:${port} \n\x1b[0m`);
});
main().catch((err) => {
    console.log(err);
});
process.on("uncaughtException", err => {
    console.log(err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map