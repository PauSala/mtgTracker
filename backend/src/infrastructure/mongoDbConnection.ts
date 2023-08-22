import mongoose from "mongoose";

export class MongoDbConnection {

    public options: mongoose.ConnectOptions;

    constructor( ) {

        this.options = {
            dbName: "mtg_arena_tracker",
            user: "",
            pass: "",
        };

    }
    public async connect(): Promise<void> {

        const uri = `mongodb://localhost`;
        await mongoose.connect(uri, this.options);

        console.log(`\x1b[36m🍃 MongoDB connected and running on  27017 🍃 \x1b[0m`);
        
    }

    public async shutDown(): Promise<void> {
        if (mongoose.connection.readyState === mongoose.STATES.connected) {
            return await mongoose.connection.close().then(() => {
                console.log("\x1b[36m  MongoDB is down \x1b[0m");
            });
        }
    }
}
