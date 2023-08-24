import { Annotation, GameInfo, GameObject, GameStateMessage, Zone } from "./step.types";

export type GameState = {
    gameObjects: GameObject[];
    zones: (Zone & { mappedInstances: { arena_id: number | undefined, instanceId: number }[] })[];
    annotations: Annotation[];
    gameInfo: GameInfo;
    phase: string;
    step: string;
    turnNumber: number;
    turnPlayer: number
    decisionPlayer: number;
    priorityPlayer: number;
}

export function updateGameState(
    gameStateMessage: GameStateMessage,
    gameState: GameState) {
    if (gameStateMessage?.gameStateMessage.gameObjects) {
        gameStateMessage.gameStateMessage.gameObjects
            .forEach(src_go => {
                gameState.gameObjects = gameState.gameObjects
                    .filter(go => src_go.instanceId !== go.instanceId);
                gameState.gameObjects.push(src_go);
            });
    }
    if (gameStateMessage.gameStateMessage?.gameInfo?.matchState === "MatchState_GameComplete") {
        //reset gameObjects on BO3 game change
        gameState.gameObjects = [];
    }
    if (gameStateMessage?.gameStateMessage.annotations) {
        gameStateMessage.gameStateMessage.annotations
            .forEach(annotation => {
                if (annotation.type[0] === "AnnotationType_ObjectIdChanged") {
                    const oldId = annotation.details?.find(d => d.key === "orig_id");
                    // const newId = annotation.details?.find(d => d.key === "new_id");
                    if (oldId) {
                        gameState.gameObjects = gameState.gameObjects
                            .filter(go => go.instanceId !== (<Array<number>>oldId?.valueInt32)[0])
                    }
                }
            })
    }
    if (gameStateMessage?.gameStateMessage.zones) {
        gameStateMessage.gameStateMessage.zones
            .forEach(zone => {
                gameState.zones = gameState.zones
                    .filter(src_zone => src_zone.zoneId !== zone.zoneId);
                let newZone = {
                    ...zone,
                    mappedInstances: zone.objectInstanceIds?.map(i => {
                        const arena_id = gameState.gameObjects.find(ob => ob.instanceId === i)?.grpId;
                        return {
                            arena_id: arena_id, instanceId: i
                        }
                    }) || []
                };
                gameState.zones.push(newZone);
            });
    }
    gameState.phase = gameStateMessage.gameStateMessage.turnInfo?.phase || gameState.phase;
    gameState.step = gameStateMessage.gameStateMessage.turnInfo?.step || gameState.step;
    gameState.turnNumber = gameStateMessage.gameStateMessage.turnInfo?.turnNumber || gameState.turnNumber;
    gameState.turnPlayer = gameStateMessage.gameStateMessage.turnInfo?.activePlayer || gameState.turnPlayer;
    gameState.decisionPlayer = gameStateMessage.gameStateMessage.turnInfo?.decisionPlayer || gameState.decisionPlayer;
    gameState.priorityPlayer = gameStateMessage.gameStateMessage.turnInfo?.priorityPlayer || gameState.priorityPlayer;
    gameState.gameInfo = gameStateMessage.gameStateMessage.gameInfo || gameState.gameInfo;
    gameState.annotations = gameStateMessage.gameStateMessage.annotations || [];
    return { ...gameState };
}
