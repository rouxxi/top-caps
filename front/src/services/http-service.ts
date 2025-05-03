class HttpService {
    baseUrlApi: string;

    constructor (baseUrlApi: string){
            this.baseUrlApi =  baseUrlApi;
    }
    async get(url : string, query: Record<string, unknown> = {}) {
        const queryParams = this.#buildQueryParams(query)
        return fetch(`${this.baseUrlApi}${url}?${queryParams}`, {method: "GET", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}}).then((response) => response.json());
    }

    async post(url: string, body : Record<string, unknown> = {}) {
        return fetch(`${this.baseUrlApi}${url}`, {method: "POST", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then((response) => response.json())
    }

    async put(url : string, body: Record<string, unknown>= {}) {
        return fetch(`${this.baseUrlApi}${url}`, {method: "PUT", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then((response) => response.json())
    }

    #buildQueryParams ( queryParamas: Record<string, unknown> = {}) {
        return Object.entries(queryParamas).map(([key, value]) => `${key}=${value}`).join('&');
    }
}



export const httpService = new HttpService('http://localhost:4200');