
import axios, { AxiosRequestConfig } from 'axios';
import { URLSearchParams } from 'url';
import {createLogger} from "@libs/logger"

export class auth0Adapter{

    constructor(
        private readonly logger = createLogger('auth0Adapter'),
        private readonly auth0domain:string =  `https://${process.env.AUTH0_DOMAIN}`,
        private readonly auth0clientId:string = process.env.AUTH0_SLS_APP_M2M_CLIENT_ID,
        private readonly auth0clientSecret:string = process.env.AUT0_SLS_APP_M2M_CLIENT_SECRET,
    ){
    }
    
    /**
     * 
     * @param email 
     * @returns 
     */
    async getUserIdbyEmail(email: string): Promise<string> {

        //Get credentials
        const token = await this.getClientCredentials();

        //Define configuration
        const config: AxiosRequestConfig = {
            url:`${this.auth0domain}/api/v2/users`,
            method:"GET",
            params:{
                q:`email:"${email}"`
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        //debug request
        this.logger.info(`Request: ${axios.getUri(config)}`)

        //request token
        return await axios.request(config)
            .then((res) => res.data[0].user_id)
            .catch((err) => {
                this.logger.error(`Error retriving user by email ${email}: ${err}`)
                throw new Error(`Error retriving user by email ${email}`);
            });
    }

    /**
     * 
     * @returns 
     */
    async getUsersNicknames():Promise<string[]>{
        return [""]
    }

    /**
     * Get client credentials
     * https://auth0.com/docs/tokens/management-api-access-tokens/get-management-api-access-tokens-for-production
     */
    private async getClientCredentials():Promise<string> {
        
        //Define url
        const url = `${this.auth0domain}/oauth/token`

        //Define headers
        const config:AxiosRequestConfig = {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        //Define parameters
        const params = new URLSearchParams();
        params.append('grant_type','client_credentials');
        params.append('client_id', this.auth0clientId);
        params.append('client_secret', this.auth0clientSecret);
        params.append('audience',`${this.auth0domain}/api/v2/`);

        //request token
        return await axios.post(url, params, config)
        .then((res)=> res.data.access_token)
        .catch((err) => {
            this.logger.error(`Error retriving auth0 token: ${err}`)
            return new Error(`Error retriving auth0 authorization token`);
        });
    }
}


