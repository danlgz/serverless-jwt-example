export type PublicUserType = {
    id: string;
    username: string;
    picture: string;
}


export default class User {
    id: string;
    username: string;
    password: string;
    picture: string;

    constructor(id: string, username: string, password: string, picture: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.picture = picture;
    }

    publicUser(): PublicUserType {
        return {
            id: this.id,
            username: this.username,
            picture: this.picture,
        }
    }
}
