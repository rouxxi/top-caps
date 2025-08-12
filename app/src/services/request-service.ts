class requestService {
    async get(url : string, query: Record<string, unknown> = {}) {
        const queryParams = this.buildQueryParams(query)
        return fetch(`${requestService.baseApiUrl}${url}?${queryParams}`, {method: "GET", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}}).then((response) => response.json());
    }

    async post(url: string, body : Record<string, unknown> = {}) {
        return fetch(`${requestService.baseApiUrl}${url}`, {method: "POST", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then((response) => response.json())
    }

    async put(url : string, body: Record<string, unknown>= {}) {
        return fetch(`${requestService.baseApiUrl}${url}`, {method: "PUT", headers: {"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then((response) => response.json())
    }

    buildQueryParams ( queryParamas: Record<string, unknown> = {}) {
        return Object.entries(queryParamas).map(([key, value]) => `${key}=${value}`).join('&');
    }

    static get baseApiUrl() {
        console.log('in baseApiUrl')
        console.log('import.meta.env.VITE_API_URL', import.meta.env.VITE_API_URL)
        return import.meta.env.VITE_API_URL || 'http://localhost:4201';
    }

}
export const RequestService = new requestService()