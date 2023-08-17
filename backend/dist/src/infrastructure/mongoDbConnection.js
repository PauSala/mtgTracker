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
exports.MongoDbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDbConnection {
    constructor() {
        this.options = {
            dbName: "mtg_arena_tracker",
            user: "",
            pass: "",
        };
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `mongodb://localhost`;
            yield mongoose_1.default.connect(uri, this.options);
            console.log(`\x1b[36m 🍃 MongoDB connected and running on  27017} 🍃 \x1b[0m`);
        });
    }
    shutDown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose_1.default.connection.readyState === mongoose_1.default.STATES.connected) {
                return yield mongoose_1.default.connection.close().then(() => {
                    console.log("\x1b[36m  MongoDB is down \x1b[0m");
                });
            }
        });
    }
}
exports.MongoDbConnection = MongoDbConnection;
//# sourceMappingURL=mongoDbConnection.js.map