import { Annotation, GameInfo, GameObject, Zone } from "./step.types";


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

export type UICard = {
    instanceId: number,
    grpId: number,
    type: string,
    zoneId: number,
    visibility: string,
    ownerSeatId: number,
    controllerSeatId: number,
    cardTypes?: Array<string>,
    name: string,
    overlayGrpId?: number,
    arena_id?: number,
    isTapped?: boolean,
    attackState?: string;
    attackInfo?: {
        targetId: number;
        damageOrdered: boolean;
    };
    defense?: { value: number };
    hasSummoningSickness?: boolean;
    blockState?: string;
    blockInfo?: {
        attackerIds: Array<number>;
        damageOrdered: true;
    };
    orderedAttackers?: Array<{ instanceId: number }>
}
