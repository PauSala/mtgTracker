import { sqLiteDb } from "./sqliteCardDatabase";

/** 
 *  get colors
    select *  from Localizations l
    inner join Enums e on e.LocId = l.LocId 
    where l.LocId  in (729778, 275167, 275168, 275169, 275170, 275171, 11, 7)
    and e.Type = 'CardColor'
    and Formatted = 1
    order by e.value
 */

export const getCard = async (grpId: string) => {
    const query =
        `SELECT 
         c.GrpId, 
         l.enUS, 
         c.Power,
         c.Toughness,
         c.AbilityIds, 
         c.LinkedFaceGrpIds,
         c.Colors,
         l2.enUS as typeName
         FROM Cards c
         INNER JOIN Localizations l on c.TitleId = l.LocId
         INNER JOIN Localizations l2 on c.TypeTextId = l2.LocId
         WHERE c.GrpId = ${grpId} 
         AND l.Formatted = 2
         AND l2.Formatted = 2`;
    const card = await (await sqLiteDb).get(query);
    if (!card) {
        return null
    }
    return mapCard(card as Record<string, string | number>);

}

export const getHability = async (abilityGrpId: string) => {

    const query = `SELECT 
     c.Id as arena_id, 
     l.enUS as name
     FROM Abilities c
     INNER JOIN Localizations l on c.TextId = l.LocId
     WHERE c.Id = ${abilityGrpId} 
     AND l.Formatted = 2`;

    const ability = await (await sqLiteDb).get(query);
    return ability || { arena_id: -1, name: "IS NOT ABILITY" };
}

export const mapCard = (card: Record<string, string | number>): GameObjectResponse => {

    return {
        arena_id: card.GrpId,
        name: card.enUS,
        habilites: (card.AbilityIds as string)
            .split(",")
            .map(a => a.slice(0, a.indexOf(":"))),
        linkedGrpIds: (card.LinkedFaceGrpIds as string).split(","),
        type: card.typeName,
        power: card.Power as string,
        toughness: card.Toughness as string,
        colors: (card.Colors as string).split(",")
    }
}

export interface GameObjectResponse {
    arena_id: string | number;
    name: string | number;
    habilites: string[];
    linkedGrpIds: string[];
    type: string | number;
    power: string;
    toughness: string;
    colors: Array<string>;
}
