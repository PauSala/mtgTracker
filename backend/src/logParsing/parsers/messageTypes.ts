export type MatchGameRoomStateChangedEvent = {
    timestamp: number,
    matchGameRoomStateChangedEvent: {
        gameRoomInfo: {
            gameRoomConfig: {
                reservedPlayers:
                {
                    userId: string,
                    playerName: string,
                    systemSeatId: number,
                    teamId: number,
                    connectionInfo: {
                        connectionState: string
                    },
                    courseId: string,
                    sessionId: string,
                    platformId: string,
                    eventId: string,
                }[]
                ,
                matchId: string,
            },
            stateType: "MatchGameRoomStateType_Playing" | "MatchGameRoomStateType_MatchCompleted",
            players?:
            {
                userId: string,
                systemSeatId: number
            }[],
            finalMatchResult?: {
                matchId: string,
                matchCompletedReason: string,
                resultList:
                {
                    scope: string,
                    result: string,
                    winningTeamId: number,
                    reason: string
                }[]
            }
        }
    }
}
