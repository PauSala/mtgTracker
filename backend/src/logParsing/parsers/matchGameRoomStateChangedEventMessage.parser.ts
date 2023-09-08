import { CustomMessage } from "../custom-message";
import { MatchGameRoomStateChangedEvent } from "./messageTypes";
import { MessageParser } from "./messageparser";

export class MatchGameRoomStateChangedEventMessageParser
    implements MessageParser<MatchGameRoomStateChangedEvent>{
    //matches literal
    private readonly MATCH_REGEX = /MatchGameRoomStateChangedEvent/;
    public static readonly MESSAGE_TYPE = "MatchGameRoomStateChangedEvent";

    public match(line: string) {
        return this.MATCH_REGEX.test(line);
    }

    public getMessage(line: string, matchId: string | null): CustomMessage<MatchGameRoomStateChangedEvent> | null {
        if (line[0] === "{") {
            try {
                const message = JSON.parse(line) as MatchGameRoomStateChangedEvent;
                return {
                    type: MatchGameRoomStateChangedEventMessageParser.MESSAGE_TYPE,
                    name: MatchGameRoomStateChangedEventMessageParser.MESSAGE_TYPE,
                    belongsToMatch: true,
                    matchId: message.matchGameRoomStateChangedEvent.gameRoomInfo.gameRoomConfig.matchId || matchId,
                    message
                }
            } catch (e) {
                console.log(e);
            }
        }
        return null;
    }
}
