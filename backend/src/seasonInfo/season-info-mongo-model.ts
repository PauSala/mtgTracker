import mongoose, { Document, Schema, model } from "mongoose";
import { ConstructedRankInfo, CurrentSeason, LimitedRankInfo, SeasonConstructedReward, SeasonInfo, SeasonLimitedReward } from "./season-info";


// Define a schema for LimitedRankInfo
const limitedRankInfoSchema = new Schema<LimitedRankInfo>({
    level: Number,
    steps: Number,
});

// Define a schema for ConstructedRankInfo
const constructedRankInfoSchema = new Schema<ConstructedRankInfo>({
    rankClass: String,
    level: Number,
    steps: Number,
});

// Define a schema for SeasonLimitedReward
const seasonLimitedRewardSchema = new Schema<SeasonLimitedReward>({
    image1: String,
    image2: String,
    prefab: String,
    referenceId: String,
    headerLocKey: String,
    descriptionLocKey: String,
    quantity: String,
    locParams: Object,
});

// Define a schema for SeasonConstructedReward
const seasonConstructedRewardSchema = new Schema<SeasonConstructedReward>({
    image1: String,
    image2: String,
    image3: String,
    prefab: String,
    referenceId: String,
    headerLocKey: String,
    descriptionLocKey: String,
    quantity: String,
    locParams: Object,
});

// Define a schema for CurrentSeason
const currentSeasonSchema = new Schema<CurrentSeason>({
    seasonOrdinal: Number,
    seasonStartTime: String,
    seasonEndTime: String,
    seasonLimitedRewards: {
        type: Map,
        of: seasonLimitedRewardSchema,
    },
    seasonConstructedRewards: {
        type: Map,
        of: seasonConstructedRewardSchema,
    },
    minMatches: Number,
});

// Define a schema for SeasonInfo
const seasonInfoSchema = new Schema<SeasonInfo>({
    currentSeason: currentSeasonSchema,
    limitedRankInfo: [limitedRankInfoSchema],
    constructedRankInfo: [constructedRankInfoSchema],
}, { timestamps: true });

// Create and export the Mongoose model for SeasonInfo
export interface SeasonInfoDocument extends SeasonInfo, Document { timestamps: true }

export const SeasonInfoMongoDbModel = mongoose.model<SeasonInfoDocument>('SeasonInfo', seasonInfoSchema);


export class SeasonInfoRepository {
    async save(seasonInfo: SeasonInfo) {
        let old = (await SeasonInfoMongoDbModel.find({ 'currentSeason.seasonOrdinal': seasonInfo.currentSeason.seasonOrdinal })).pop();

        if (old) {
            old.currentSeason = seasonInfo.currentSeason;
            old.limitedRankInfo = seasonInfo.limitedRankInfo;
            old.constructedRankInfo = seasonInfo.constructedRankInfo;
            await old.save();
            return
        }
        const toSave = new SeasonInfoMongoDbModel(seasonInfo);
        await toSave.save();
    }
}
