"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMongoDbModel = exports.messageSchema = void 0;
const mongoose_1 = require("mongoose");
const Message = {
    type: { type: mongoose_1.Schema.Types.String, required: true },
    message: { type: mongoose_1.Schema.Types.Mixed, required: true }
};
exports.messageSchema = new mongoose_1.Schema(Message, { timestamps: true });
exports.MessageMongoDbModel = (0, mongoose_1.model)("message", exports.messageSchema);
//# sourceMappingURL=messagesMongoDb.js.map