import { GameObject, Zone } from "./step.types";

export type GameState = {
    gameObjects: GameObject[];
    zones: (Zone & { mappedInstances: { arena_id: number | undefined, instanceId: number }[] })[];
    phase: string;
    step: string;
    turnNumber: number;
    turnPlayer: number
    decisionPlayer:  number;
    priorityPlayer:  number;
}

export type UICard = {
    instanceId: number,
    grpId: number,
    type: string,
    zoneId: number,
    visibility: string,
    ownerSeatId: number,
    controllerSeatId: number,
    cardTypes: Array<string>,
    name: string,
    overlayGrpId: number,
    arena_id: number,
    image_uris: [
        {
            small: string,
            normal: string,
            large: string,
            png: string,
            art_crop: string,
            border_crop: string,
        }
    ]
}
