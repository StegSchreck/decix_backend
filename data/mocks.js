import casual from 'casual';

const mocks = {
    String: () => 'It works!',
    Query: () => ({
        user: (root, args) => {
            return { firstName: args.firstName, lastName: args.lastName };
        },
        matrix: (root, args) => {
            return { title: args.title };
        },
        category: (root, args) => {
            return { title: args.title };
        },
        alternative: (root, args) => {
            return { title: args.title };
        },
        entry: (root, args) => {
            return { title: args.title };
        },
    }),
    User: () => ({ firstName: () => casual.first_name, lastName: () => casual.last_name }),
    Matrix: () => ({ title: () => casual.title }),
    Category: () => ({ title: () => casual.title }),
    Alternative: () => ({ title: () => casual.title }),
    Entry: () => ({ title: () => casual.title }),
};

export default mocks;
