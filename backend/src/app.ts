/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response, json } from "express";
import * as http from "http";
import cors from "cors";
import { MongoDbConnection } from "./infrastructure/mongoDb/mongoDbConnection";
import {
    GreToClientMessageMongoDbModel,
    IMessage,
    FromClientMessageMongoDbModel,
    ClientToGREMessageMongoDbModel,
    FromServerMessageMongoDbModel,
    MatchGameRoomStateMessageMongoDbModel
} from "./infrastructure/mongoDb/messagesMongoDb";
import { Document, Types } from "mongoose";
import { GameInfo, GameStateMessage } from "./domain/game-state-message";
import { GameState, updateGameState } from "./domain/gamePlay/stepProcessor";
import { getCard, getHability } from "./infrastructure/sqliteDb/sqliteCardRepository";


export class App {
    public app: Application;
    private httpServer: http.Server;


    constructor() {
        this.app = express();
        this.app.use(json());
        this.app.use(cors({
            origin: "*"
        }));


        this.app.get("/health", (_req: Request, res: Response) => {
            res.status(200).json({ ok: "Sever is running" });
        });

        this.app.get("/objects", async (req, res) => {
            const response: any[] = [];
            /*    parsedLog
                   .lines
                   .filter(o => o.type === "GreToClientEvent" && o.matchId === "00109e5b-4ffd-42f3-adae-571014377fd9")
                   .forEach(o => {
                       const data = o.message.greToClientEvent.greToClientMessages
                           .filter((e: any) => e.type === "GREMessageType_GameStateMessage");
                       if (data.length) {
                           for (const elem of data) {
                               response.push(elem);
                           }
                       }
                   }); */
            return res.json(response);
        });

        this.app.get("/gamePlay", async (req, res) => {
            const gameStateMessages: any[] = [];
            const start = performance.now();
            /* parsedLog
                .lines
                .filter(o => o.type === "GreToClientEvent" && o.matchId === "00109e5b-4ffd-42f3-adae-571014377fd9")
                .forEach(o => {
                    const data = o.message.greToClientEvent.greToClientMessages
                        .filter((e: any) => e.type === "GREMessageType_GameStateMessage");
                    if (data.length) {
                        for (const elem of data) {
                            gameStateMessages.push(elem);
                        }
                    }
                }); */
            const states: GameState[] = [];
            let currentGameState: GameState = {
                gameObjects: [],
                zones: [],
                phase: "",
                step: "",
                turnPlayer: -1,
                decisionPlayer: -1,
                priorityPlayer: -1,
                turnNumber: -1,
                gameInfo: {} as GameInfo,
                annotations: []
            }
            gameStateMessages.forEach((obj: GameStateMessage) => {
                const newState = updateGameState(obj, currentGameState);
                states.push(newState);
                currentGameState = { ...newState };
            });
            const end = performance.now();
            const timeToProcess = (end - start) / 1000.0;
            console.log(`\x1b[36mProcess game took ${timeToProcess} miliseconds \n\x1b[0m`);
            res.json(states);

        })

        this.app.get("/card/:cardid", async (req, res) => {
            const cardId = req.params.cardid;
            const card = await getCard(cardId);
            return res.json(card);
        })

        this.app.get("/ability/:abilityId", async (req, res) => {
            const abilityId = req.params.abilityId;
            const card = await getHability(abilityId);
            return res.json(card);
        });

        this.httpServer = this.getHTTPServer();
    }

    public async init(port: string) {
        const mongoConnection = new MongoDbConnection();
        await mongoConnection.connect();
        await this.populateMongo();
        return this.listen(port);
    }


    private async populateMongo() {
        await GreToClientMessageMongoDbModel.deleteMany({});
        await ClientToGREMessageMongoDbModel.deleteMany({});
        await FromClientMessageMongoDbModel.deleteMany({});
        await FromServerMessageMongoDbModel.deleteMany({});
        await MatchGameRoomStateMessageMongoDbModel.deleteMany({});
        //await this.populateMessages(this.parsedLog.lines);
    }

    private async populateMessages(objects: any[]) {

        console.log("\x1b[33mloading messages... \x1b[0m");

        for (const object of objects) {
            let model: Document<unknown, object, IMessage> & IMessage & {
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
        console.log("\x1b[33mDone!... \x1b[0m");
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

