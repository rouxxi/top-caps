export class HttpService {
    static async get(url : string, query: Record<string, unknown> = {}) {
        const queryParams = this.buildQueryParams(query)
        return fetch(`${this.baseApiUrl}${url}?${queryParams}`, {method: "GET", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}}).then((response) => response.json());
    }

    static async post(url: string, body : Record<string, unknown> = {}) {
        return fetch(`${this.baseApiUrl}${url}`, {method: "POST", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then((response) => response.json())
    }

    static async put(url : string, body: Record<string, unknown>= {}) {
        return fetch(`${this.baseApiUrl}${url}`, {method: "PUT", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then((response) => response.json())
    }

    buildQueryParams ( queryParamas: Record<string, unknown> = {}) {
        return Object.entries(queryParamas).map(([key, value]) => `${key}=${value}`).join('&');
    }

    get baseApiUrl() {
        return import.meta.env.VITE_API_URL || 'http://localhost:4201';
    }
}