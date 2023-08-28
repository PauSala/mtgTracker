
import { resolve } from "path";

export const getLogFilePath = () => {
    return resolve(__dirname, "..", "..", "..", "..", `/home/${process.env.USER}/Documents/Player.log`);
};
