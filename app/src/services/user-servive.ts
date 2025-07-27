import { v4 as uuidv4 } from 'uuid';

class UserServive {
    id: string;
    constructor() {
        const userId = this.me;
        if (!userId) {
            const user = uuidv4()
            window.localStorage.setItem('user-id', user)
            this.id = user;
        } else {
            this.id = userId
        }
    }

    get me () {
        return window.localStorage.getItem("user-id");
    }

}


export const userService = new UserServive();