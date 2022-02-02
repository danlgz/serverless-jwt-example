import { v4 as uuid } from "uuid";

import User from "../../src/domain/User";

describe('User domain', () => {
    it('creation', () => {
        const id = uuid();
        const user = new User(id, 'root', 'root', 'http://placehold.it/32x32');

        expect(user.id).toBe(id);
        expect(user.username).toBe('root');
        expect(user.password).toBe('root');
        expect(user.picture).toBe('http://placehold.it/32x32');
    });
});
