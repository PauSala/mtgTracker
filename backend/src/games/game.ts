import { GameStateMessage, GameObject } from "../domain/game-state-message";
import { getCard } from "../infrastructure/sqliteDb/sqliteCardRepository";
import { MatchGameRoomStateChangedEvent } from "../logParsing/parsers/messageTypes";

//Deck_UpsertDeckV2


export class GameHandler {
    private endGameMessage!: MatchGameRoomStateChangedEvent;
    private gameStateMessages: GameStateMessage[] = [];
    private playerDeckId: string = "";
    private userId: string = "";
    private userSeatId!: number | undefined;

    constructor(private id: string) {

    }

    public setUserId(id: string) {
        this.userId = id;
    }

    public setUserSeatId() {
        this.userSeatId = this.endGameMessage.matchGameRoomStateChangedEvent.gameRoomInfo.gameRoomConfig.reservedPlayers
            ?.find(p => p.userId === this.userId)?.systemSeatId;
    }

    public setId(id: string) {
        this.id = id;
    }

    public setPlayerDeck(deckId: string) {
        this.playerDeckId = deckId;
    }

    public setEndGameMessage(message: MatchGameRoomStateChangedEvent) {
        this.endGameMessage = message;
    }
    public addGameStateMessage(message: GameStateMessage) {
        this.gameStateMessages.push(message);
    }

    public getEndGame() {
        return this.endGameMessage;
    }

    private mapColor(color: string) {
        switch (color) {
            case "0":
                return "colorless"
            case "1":
                return "W";
            case "2":
                return "U";
            case "3":
                return "B";
            case "4":
                return "R";
            case "5":
                return "G";
            case "6":
                return "land";
            case "7":
                return "artifact"
            default:
                return "colorless"
        }
    }

    private async getOponentColors() {
        const excludedTypes = ["GameObjectType_Ability", "GameObjectType_Token"];

        const oponentGameObjects = this.gameStateMessages
            .filter(state => state.gameStateMessage.gameObjects)
            .reduce((a: GameObject[], b: GameStateMessage) => {
                const gameObjects = b.gameStateMessage.gameObjects
                    ?.filter(go => go.ownerSeatId !== this.userSeatId && !excludedTypes.includes(go.type))
                    .filter(go => !a.map(elem => elem.grpId).includes(go.grpId));
                return gameObjects ? [...a, ...gameObjects] : a;
            }, []);

        const colors: Array<string> = [];
        for (const object of oponentGameObjects) {
            const card = await getCard(`${object.grpId}`);
            if (card?.colors) {
                card.colors.forEach(color => {
                    const mappedColor = this.mapColor(color);
                    if (!colors.includes(mappedColor)) {
                        colors.push(mappedColor);
                    }
                })
            }
        }
        return colors;
    }

    public async build() {

        const players = this.getEndGame()
            .matchGameRoomStateChangedEvent.gameRoomInfo.gameRoomConfig.reservedPlayers;
        this.setUserSeatId();
        const oponent = players && players.find(p => p.teamId !== this.userSeatId)?.playerName;
        const oponentColors = await this.getOponentColors();
        const result = this.getEndGame().matchGameRoomStateChangedEvent
            ?.gameRoomInfo.finalMatchResult
            ?.resultList
            .filter((result: any) => result.scope === "MatchScope_Game")
            .map((res: any) => res.winningTeamId).pop() === this.userSeatId ? "win" : "loss";
        return {
            playerDeckId: this.playerDeckId,
            oponent,
            oponentDeckColors: oponentColors,
            result,
            matchId: this.id,
            onThePlay: this.userSeatId === 1
        };
    }
}
