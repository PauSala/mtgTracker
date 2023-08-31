
import { resolve } from "path";

export const getLogFilePath = () => {
    return resolve(`/home/${process.env.USER}/Games/magic-the-gathering-arena/drive_c/users/${process.env.USER}/AppData/LocalLow/Wizards Of The Coast/MTGA/Player.log`)
};
