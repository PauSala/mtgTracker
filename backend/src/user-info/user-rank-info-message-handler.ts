import { CustomMessage } from "../logParsing/custom-message";
import { FromClientMessageParser } from "../logParsing/parsers/fromClientMessage.parser";
import { PlayerStats } from "./user-rank-info";
import { UserInfoRepository } from "./user-rank-info-mongo-model";

export class UserRankInfoMessagehandler {

    constructor(private userInfoRepository: UserInfoRepository) {

    }

    isUserRankInfo(message: CustomMessage<Record<string, unknown>>) {
        return message.type === FromClientMessageParser.MESSAGE_TYPE
            && message.name === "Rank_GetCombinedRankInfo";
    }

    async saveUserRankInfo(message: CustomMessage<Record<string, unknown>>, matchId: string | undefined) {
        console.log(`\x1b[34mSAVE USER INFO\n\x1b[0m`);
        const found = await this.userInfoRepository.findByMatchId(matchId || "");
        if (!found) {
            await this.userInfoRepository.save(message.message as unknown as PlayerStats, matchId);
        }
    }
}
