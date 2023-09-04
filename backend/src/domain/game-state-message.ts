export type GameStage = "GameStage_Start" | "GameStage_Play" | "GameStage_GameOver";
export type Phase =
    "Phase_Beginning" |
    "Phase_Main1" |
    "Phase_Combat" |
    "Phase_Main2" |
    "Phase_Ending"

export type Step =
    "Step_Upkeep" |
    "Step_BeginCombat" |
    "Step_DeclareAttack" |
    "Step_EndCombat" |
    "Step_End" |
    "Step_Draw" |
    "Step_DeclareBlock" |
    "Step_CombatDamage" |
    "Step_FirstStrikeDamage"

export type AnnotationType =
    "AnnotationType_LayeredEffectCreated" |
    "AnnotationType_LayeredEffectDestroyed" |
    "AnnotationType_NewTurnStarted" |
    "AnnotationType_PhaseOrStepModified" |
    "AnnotationType_ObjectIdChanged" |
    "AnnotationType_ZoneTransfer" |
    "AnnotationType_UserActionTaken" |
    "AnnotationType_AbilityInstanceCreated" |
    "AnnotationType_TappedUntappedPermanent" |
    "AnnotationType_ManaPaid" |
    "AnnotationType_AbilityInstanceDeleted" |
    "AnnotationType_ResolutionStart" |
    "AnnotationType_ResolutionComplete" |
    "AnnotationType_ShouldntPlay" |
    "AnnotationType_ModifiedLife" |
    "AnnotationType_CounterAdded" |
    "AnnotationType_PlayerSelectingTargets" |
    "AnnotationType_PlayerSubmittedTargets" |
    "AnnotationType_RevealedCardCreated" |
    "AnnotationType_DamageDealt" |
    "AnnotationType_CounterRemoved" |
    "AnnotationType_RevealedCardDeleted" |
    "AnnotationType_TokenCreated" |
    "AnnotationType_SyntheticEvent" |
    "AnnotationType_PowerToughnessModCreated" |
    "AnnotationType_GainDesignation" |
    "AnnotationType_PhasedOut" |
    "AnnotationType_ChoiceResult" |
    "AnnotationType_PhasedIn" |
    "AnnotationType_TokenDeleted"

export type AnnotationDetailsKey =
    "phase" |
    "step" |
    "orig_id" |
    "new_id" |
    "zone_src" |
    "zone_dest" |
    "category" |
    "actionType" |
    "abilityGrpId" |
    "source_zone" |
    "tapped" |
    "id" |
    "color" |
    "grpid" |
    "Reason" |
    "life" |
    "counter_type" |
    "transaction_amount" |
    "damage" |
    "type" |
    "markDamage" |
    "power" |
    "toughness" |
    "DesignationType" |
    "Choice_Value" |
    "Choice_Domain" |
    "Choice_Sentiment"

export type Visibility = "Visibility_Public" | "Visibility_Private" | "Visibility_Hidden"
export type ZoneType =
    "ZoneType_Revealed" |
    "ZoneType_Suppressed" |
    "ZoneType_Pending" |
    "ZoneType_Command" |
    "ZoneType_Stack" |
    "ZoneType_Battlefield" |
    "ZoneType_Exile" |
    "ZoneType_Limbo" |
    "ZoneType_Hand" |
    "ZoneType_Library" |
    "ZoneType_Graveyard" |
    "ZoneType_Sideboard"

export type AnnotationValueString =
    "PlayLand" |
    "CastSpell" |
    "Resolve" |
    "Draw" |
    "EntersTapped" |
    "Exile" |
    "Put" |
    "Discard" |
    "SBA_LegendRule" |
    "Legendary" |
    "Sacrifice" |
    "SBA_Damage" |
    "SBA_ZeroLoyalty";

export type GameObject = {
    instanceId: number;
    grpId: number;
    type: string;
    zoneId: number;
    visibility: Visibility;
    ownerSeatId: 1;
    controllerSeatId: 1;
    name: number;
    abilities: Array<number>;
    overlayGrpId: number;
    power?: { value: number };
    toughness?: { value: number };
    parentId?: number;
    viewers?: Array<number>;
    isTapped?: boolean;
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

export type Zone = {
    zoneId: number;
    type: ZoneType;
    visibility: Visibility;
    ownerSeatId?: number;
    objectInstanceIds?: Array<number>;
    viewers?: Array<number>
}

export type Annotation = {
    id: number;
    affectedIds: Array<number>;
    type: Array<AnnotationType>;
    affectorId?: number;
    details?: {
        key: AnnotationDetailsKey;
        type: "KeyValuePairValueType_int32" | "KeyValuePairValueType_string";
        valueInt32?: Array<number>;
        valueString?: Array<AnnotationValueString>
    }[]
}

export type GameInfo = {
    matchID: string;
    gameNumber: number;
    stage: GameStage;
    type: string;
    variant: string;
    matchState: string;
    matchWinCondition: string;
    superFormat: string;
    mulliganType: string;
}

export type TurnInfo = {
    activePlayer?: number;
    priorityPlayer?: number;
    decisionPlayer?: number;
    phase?: string;
    step?: string;
    turnNumber?: number;
    nextPhase?: string;
    nextStep?: string;

}

export type Player = {
    lifeTotal: number;
    systemSeatNumber: number;
    maxHandSize: number;
    turnNumber: number;
    teamId: number;
    timerIds: Array<number>;
    controllerSeatId: number;
    controllerType: string,
    pendingMessageType?: string,
    startingLifeTotal: number;
}

export type GameStateMessage = {
    gameStateId: number;
    msgId: number;
    gameStateMessage: {
        type: string | "GameStateType_Full" | "GameStateType_Diff";
        gameStateId: number;
        gameInfo: GameInfo;
        players?: Player[];
        turnInfo?: TurnInfo;
        zones?: Zone[];
        gameObjects?: GameObject[];
        annotations?: Annotation[];
        prevGameStateId: number,
    };
}
