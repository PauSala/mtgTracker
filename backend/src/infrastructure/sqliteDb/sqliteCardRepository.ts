import { sqLiteDb } from "./sqliteCardDatabase";


export const getCard = async (grpId: string) => {
    const query =
        `SELECT 
         c.GrpId, 
         l.enUS, 
         c.AbilityIds, 
         c.LinkedFaceGrpIds,
         l2.enUS as typeName
         FROM Cards c
         INNER JOIN Localizations l on c.TitleId = l.LocId
         INNER JOIN Localizations l2 on c.TypeTextId = l2.LocId
         WHERE c.GrpId = ${grpId} 
         AND l.Formatted = 1
         AND l2.Formatted = 1`;
    const card = await (await sqLiteDb).get(query);
    return mapCard(card as Record<string, string | number>);

}

export const mapCard = (card: Record<string, string | number> | undefined) => {
    if (!card) {
        return {
            arena_id: 0,
            name: "not a card",
            habilites: [],
            linkedGrpIds: [],
            type: "NOT_CARD"
        }
    }
    return {
        arena_id: card.GrpId,
        name: card.enUS,
        habilites: (card.AbilityIds as string)
            .split(",")
            .map(a => a.slice(0, a.indexOf(":"))),
        linkedGrpIds: card.LinkedFaceGrpIds,
        type: card.typeName
    }
}
