import express, { Application, Request, Response, json } from "express";
import * as http from "http";
import cors from 'cors';
import { MongoDbConnection } from "./infrastructure/mongoDbConnection";
import { GreToClientMessageMongoDbModel, IMessage, FromClientMessageMongoDbModel, ClientToGREMessageMongoDbModel, FromServerMessageMongoDbModel, MatchGameRoomStateMessageMongoDbModel } from "./infrastructure/messagesMongoDb";
import { Document, Types } from "mongoose";


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

        this.app.get("/objects/:page", async (req, res) => {
            const page = parseInt(req.params.page)
            res.json(objects[page]);
        })

        this.app.get("/objects/props/size", async (req, res) => {
            res.json({ size: objects.length });
        })

        this.httpServer = this.getHTTPServer();
    }

    public async init(port: string) {
        const mongoConnection = new MongoDbConnection();
        await mongoConnection.connect();

        await GreToClientMessageMongoDbModel.deleteMany({});
        await ClientToGREMessageMongoDbModel.deleteMany({});
        await FromClientMessageMongoDbModel.deleteMany({});
        await FromServerMessageMongoDbModel.deleteMany({});
        await MatchGameRoomStateMessageMongoDbModel.deleteMany({});

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
            if(model){
                await model.save();
            }
        }
        return this.listen(port);
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

