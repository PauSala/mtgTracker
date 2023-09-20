import { Controller, Get, Route, Path } from "tsoa";
import { UserInfoRepository } from "./user-rank-info-mongo-model";
import { PlayerStats } from "./user-rank-info";

@Route("user-stats")
export class GetUserInfoController extends Controller {

    private userInfoRepository = new UserInfoRepository();

    @Get("last")
    public async getCurrentStats(
    ): Promise<PlayerStats | null> {
        return this.userInfoRepository.getCurrentStatsInfo();
    }

    @Get("all")
    public async getSeasonStats(): Promise<PlayerStats[]> {
        return this.userInfoRepository.getSeasonStats();
    }
}
