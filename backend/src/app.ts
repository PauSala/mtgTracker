import express, { Application, Request, Response, json } from "express";
import * as http from "http";
import cors from 'cors';
import { MongoDbConnection } from "./infrastructure/mongoDbConnection";
import { GreToClientMessageMongoDbModel, IMessage, FromClientMessageMongoDbModel, ClientToGREMessageMongoDbModel, FromServerMessageMongoDbModel, MatchGameRoomStateMessageMongoDbModel } from "./infrastructure/messagesMongoDb";
import { Document, Types } from "mongoose";
import { resolve } from "path";
import { CardMongoDbModel } from "./infrastructure/cardsMongoDb";
import { readFileSync } from "fs";
import { GameStateMessage } from "./lib/gamePlay/step.types";
import { GameState, updateGameState } from "./lib/gamePlay/stepProcessor";


export class App {
    public app: Application;
    private httpServer: http.Server;


    constructor(
        private objects: any[]
    ) {
        this.app = express();
        this.app.use(json());
        this.app.use(cors({
            origin: '*'
        }));


        this.app.get('/health', (_req: Request, res: Response) => {
            res.status(200).json({ ok: 'Sever is running' });
        });

        this.app.get("/objects", async (req, res) => {
            const response: any[] = [];
            objects
                .filter(o => o.type === "GreToClientEvent" && o.matchId === "00109e5b-4ffd-42f3-adae-571014377fd9")
                .forEach(o => {
                    const data = o.message.greToClientEvent.greToClientMessages
                        .filter((e: any) => e.type === "GREMessageType_GameStateMessage");
                    if (data.length) {
                        for (const elem of data) {
                            response.push(elem);
                        }
                    }
                });
            return res.json(response);
        });

        this.app.get("/gamePlay", async (req, res) => {
            const gameStateMessages: any[] = [];
            let start = performance.now();
            objects
                .filter(o => o.type === "GreToClientEvent" && o.matchId === "00109e5b-4ffd-42f3-adae-571014377fd9")
                .forEach(o => {
                    const data = o.message.greToClientEvent.greToClientMessages
                        .filter((e: any) => e.type === "GREMessageType_GameStateMessage");
                    if (data.length) {
                        for (const elem of data) {
                            gameStateMessages.push(elem);
                        }
                    }
                });
            let states: GameState[] = [];
            let currentGameState: GameState = {
                gameObjects: [],
                zones: [],
                phase: "",
                step: "",
                turnPlayer: -1,
                decisionPlayer: -1,
                priorityPlayer: -1,
                turnNumber: -1
            }
            gameStateMessages.forEach((obj: GameStateMessage) => {
                const newState = updateGameState(obj, currentGameState);
                states.push(newState);
                currentGameState = { ...newState };
            });
            let end = performance.now();
            console.log((end - start) / 1000.0);
            res.json(states);

        })

        this.app.get("/card/:cardid", async (req, res) => {
            const cardId = req.params.cardid;
            const card = await CardMongoDbModel.findOne({ arena_id: cardId });
            return res.json(card);
        })

        this.app.get("/objects/props/size", async (req, res) => {
            res.json({ size: objects.length });
        })

        this.httpServer = this.getHTTPServer();
    }

    public async init(port: string) {
        const mongoConnection = new MongoDbConnection();
        await mongoConnection.connect();
        await this.populateMongo();

        return this.listen(port);
    }

    private async populateMongo() {
        //await this.populateCards();
        //await this.populateMessages();
    }

    private async populateCards() {
        await CardMongoDbModel.deleteMany({});
        const path = resolve(__dirname, "data", "cards.json");
        const file = readFileSync(path, "utf-8");
        const cards = JSON.parse(file);
        console.log(`\x1b[33mloading card database... \x1b[0m`);
        for (const card of cards) {
            //Only MTGArena cards
            if (!card.arena_id) {
                continue
            }
            if (!card.card_faces) {
                card.image_uris = [card.image_uris];
            } else {
                card.image_uris = card.card_faces.map((c: any) => c.image_uris);
            }
            delete card.id //to avoid mongo complainig about trying to set _id as non ObjectId. 
            const cardModel = new CardMongoDbModel(card);
            await cardModel.save();
        }
        console.log(`\x1b[33mDone! \x1b[0m`);
    }

    private async populateMessages() {
        await GreToClientMessageMongoDbModel.deleteMany({});
        await ClientToGREMessageMongoDbModel.deleteMany({});
        await FromClientMessageMongoDbModel.deleteMany({});
        await FromServerMessageMongoDbModel.deleteMany({});
        await MatchGameRoomStateMessageMongoDbModel.deleteMany({});
        console.log(`\x1b[33mloading messages... \x1b[0m`);
        for (const object of this.objects) {
            let model: Document<unknown, {}, IMessage> & IMessage & {
                _id: Types.ObjectId;
            } | null = null;
            switch (object.type) {
                case "GreToClientEvent":
                    model = new GreToClientMessageMongoDbModel(object);
                    break;
                case "fromClientMessage":
                    model = new FromClientMessageMongoDbModel(object);
                    break;
                case "fromServerMessage":
                    model = new FromServerMessageMongoDbModel(object);
                    break;
                case "ClientToGREMessage":
                    model = new ClientToGREMessageMongoDbModel(object);
                    break;
                case "MatchGameRoomStateChangedEvent":
                    model = new MatchGameRoomStateMessageMongoDbModel(object);
                    break;
            }
            if (model) {
                await model.save();
            }
        }
        console.log(`\x1b[33mDone!... \x1b[0m`);
    }

    private async listen(port: string): Promise<void> {
        return new Promise(resolve => {
            this.httpServer.listen(port, () => resolve());
        });
    }

    private getHTTPServer() {
        return http.createServer(this.app);
    }
}

