import { CustomMessage } from "./types";

export class ClientToMatchServiceMessageType_ClientToGREMessageParser{

    //TO-DO: maybe ClientToMatchServiceMessageType_ClientToGREUIMessage are relevant too, for now let's ignore it;
    
    //matches literal
    private readonly MATCH_REGEX = /ClientToMatchServiceMessageType_ClientToGREMessage/;

    private currentStringToParse = "";

    public match(line: string) {
        return this.MATCH_REGEX.test(line);
    }

    public getMessage(line: string): CustomMessage | null {
        this.currentStringToParse += line;
        if(line[0]!== "}"){
            return null
        }
        const data = JSON.parse(this.currentStringToParse);
        this.currentStringToParse = "";
        return {
            type: "ClientToMatchServiceMessageType_ClientToGREMessage",
            message: data
        }
    }
}
