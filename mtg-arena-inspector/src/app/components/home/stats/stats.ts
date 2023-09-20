export interface IPlayerStats {
    constructedSeasonOrdinal: number;
    constructedClass: string;
    constructedLevel: number;
    constructedMatchesWon: number;
    constructedMatchesLost: number;
    constructedMatchesDrawn: number;
    constructedPercentile: number;
    limitedSeasonOrdinal: number;
    limitedClass: string;
    limitedLevel: number;
    limitedPercentile: number;
    limitedMatchesWon: number;
    limitedMatchesLost: number;
    limitedMatchesDrawn: number;
    matchId?: string
}
