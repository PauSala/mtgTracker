import mongoose, { Schema, Document } from 'mongoose';
import { PlayerStats } from './user-rank-info';

// Define a schema for PlayerStats
export const playerStatsSchema = new Schema<PlayerStats>({
    constructedSeasonOrdinal: Number,
    constructedClass: String,
    constructedLevel: Number,
    constructedMatchesWon: Number,
    constructedMatchesLost: Number,
    constructedMatchesDrawn: Number,
    constructedPercentile: Number,
    limitedSeasonOrdinal: Number,
    limitedClass: String,
    limitedLevel: Number,
    limitedPercentile: Number,
    limitedMatchesWon: Number,
    limitedMatchesLost: Number,
    limitedMatchesDrawn: Number,
    matchId: String
}, { strict: false, timestamps: true });

// Create and export the Mongoose model for PlayerStats
export interface PlayerStatsDocument extends PlayerStats, Document { }

export const PlayerStatsModel = mongoose.model<PlayerStatsDocument>('PlayerStats', playerStatsSchema);


export class UserInfoRepository {
    async save(playerStats: PlayerStats, matchId: string | undefined) {
        playerStats.matchId = matchId;
        const toSave = new PlayerStatsModel(playerStats);
        await toSave.save();
    }

    async getCurrentStatsInfo(): Promise<PlayerStats | null> {
        const data = await PlayerStatsModel
            .findOne().sort({ timestamp: -1 }).exec()
        return data;
    }

    async getSeasonStats(): Promise<PlayerStats[]> {
        const last = await this.getCurrentStatsInfo();
        if (last) {
            return PlayerStatsModel.find({ constructedSeasonOrdinal: last.constructedSeasonOrdinal })
        }
        return [];
    }

    async findByMatchId(matchId: string) {
        return PlayerStatsModel.findOne({ matchId })
    }
}
