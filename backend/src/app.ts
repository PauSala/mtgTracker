import express, { Application, Request, Response, json } from "express";
import * as http from "http";
import cors from 'cors';


export class App {
    public app: Application;
    private httpServer: http.Server;


    constructor(
        objects: any[]
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
            res.json({size: objects.length});
        })

        this.httpServer = this.getHTTPServer();
    }

    public init(port: string) {
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

