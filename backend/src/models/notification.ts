import { noteInit } from "./note";
import { iUser } from "./user";



export interface iNotification {
    message: string,
    noteId: string,
    user:iUser,
    body?:noteInit
}

