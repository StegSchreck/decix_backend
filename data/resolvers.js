const resolvers = {
    Query: {
        user(root, args) {
            return { id: 1, firstName: 'Hello', lastName: 'World', email: 'foo@bar.com' };
        },
        allUsers() {
            return [{ id: 1, firstName: 'Hello', lastName: 'World', email: 'foo@bar.com' }];
        },
        matrix(root, args) {
            return { id: 1, title: 'Matrix1' };
        },
        category(root, args) {
            return { id: 1, title: 'Category1', sorting: 0, weight: 100 };
        },
        alternative(root, args) {
            return { id: 1, title: 'Alternative1', sorting: 0 };
        },
        entry(root, args) {
            return { id: 1, title: 'Entry1' };
        }
    },
    Matrix: {
        creator(matrix) {
            return { id: 1, firstName: 'Hello', lastName: 'World', email: 'foo@bar.com' };
        },
        categories(matrix) {
            return [{ id: 1, title: 'Category1', sorting: 0, weight: 100  }];
        },
        alternatives(matrix) {
            return [{ id: 1, title: 'Alternative1', sorting: 0 }];
        }
    },
    Category: {
        creator(category) {
            return { id: 1, firstName: 'Hello', lastName: 'World', email: 'foo@bar.com' };
        }
    },
    Alternative: {
        creator(alternative) {
            return { id: 1, firstName: 'Hello', lastName: 'World', email: 'foo@bar.com' };
        }
    },
    Entry: {
        author(entry) {
            return { id: 1, firstName: 'Hello', lastName: 'World', email: 'foo@bar.com' };
        },
        category(entry) {
            return { id: 1, title: 'Category1', sorting: 0, weight: 100 };
        },
        alternative(entry) {
            return { id: 1, title: 'Alternative1', sorting: 0 };
        }
    }
};

export default resolvers;
