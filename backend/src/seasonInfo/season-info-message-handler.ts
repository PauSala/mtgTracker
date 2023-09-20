import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { SeasonInfo } from "./season-info";
import { SeasonInfoRepository } from "./season-info-mongo-model";

export class SeasonInfoMessageHandler {
    constructor(private seasonInfoRepository: SeasonInfoRepository) {

    }

    isSeasonInfoMessage(message: CustomMessage<Record<string, unknown>>) {
        return message.type === FromClientMessageParser.MESSAGE_TYPE
            && message.name === "Rank_GetSeasonAndRankDetails";
    }

    async saveSeasonInfo(message: CustomMessage<Record<string, unknown>>) {
        await this.seasonInfoRepository.save(message.message as unknown as SeasonInfo)
    }
}
