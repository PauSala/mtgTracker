export interface LimitedRankInfo {
    level: number;
    steps: number;
}

export interface ConstructedRankInfo {
    rankClass: string;
    level: number;
    steps: number;
}

export interface SeasonLimitedReward {
    image1: string;
    image2: string;
    prefab: string;
    referenceId: string;
    headerLocKey: string;
    descriptionLocKey: string;
    quantity: string;
    locParams: Record<string, any>;
}

export interface SeasonConstructedReward {
    image1: string;
    image2: string;
    image3: string;
    prefab: string;
    referenceId: string;
    headerLocKey: string;
    descriptionLocKey: string;
    quantity: string;
    locParams: Record<string, any>;
}

export interface CurrentSeason {
    seasonOrdinal: number;
    seasonStartTime: string;
    seasonEndTime: string;
    seasonLimitedRewards: Record<string, SeasonLimitedReward>;
    seasonConstructedRewards: Record<string, SeasonConstructedReward>;
    minMatches: number;
}

export interface SeasonInfo {
    currentSeason: CurrentSeason;
    limitedRankInfo: LimitedRankInfo[];
    constructedRankInfo: ConstructedRankInfo[];
}
