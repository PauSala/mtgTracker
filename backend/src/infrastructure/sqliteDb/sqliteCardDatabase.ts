import { resolve } from 'path';
import { AsyncDatabase } from "promised-sqlite3";
const path = resolve(__dirname, "..", "..", "data", "raw_card_database.sqlite");
export const sqLiteDb = AsyncDatabase.open(path);





