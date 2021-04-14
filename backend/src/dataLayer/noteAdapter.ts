import { note } from "@models/note";
import {createLogger} from "@libs/logger"


export class postAdapter{

    constructor(
        private readonly logger = createLogger('itemAcess')){

    }

    async getPost(userId:string, label?: string):Promise<note[]>{
        throw("not implemented");
    }

    async putPost(note: note): Promise<note> {
        this.logger.info(JSON.stringify(note));
        throw("Method not implemented.");
    }
}