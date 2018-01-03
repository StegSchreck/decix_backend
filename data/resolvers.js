import { Matrix, Category, Alternative, Entry } from './connectors';

const resolvers = {
    Query: {
        matrix(root, args) {
            return Matrix.find(args);
        },
        category(root, args) {
            return Category.find(args);
        },
        alternative(root, args) {
            return Alternative.find(args);
        },
        entry(root, args) {
            return Entry.find(args);
        }
    },
    // Mutation: {
    // },
    Matrix: {
        categories(matrix) {
            return matrix.categories;
        },
        alternatives(matrix) {
            return matrix.alternatives;
        }
    },
    Category: {
    },
    Alternative: {
    },
    Entry: {
        category(entry) {
            return entry.category;
        },
        alternative(entry) {
            return entry.alternative;
        }
    }
};

export default resolvers;
