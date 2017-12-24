import { User, Matrix, Category, Alternative, Entry } from './connectors';

const resolvers = {
    Query: {
        user(root, args) {
            return User.find({ where: args });
        },
        allUsers() {
            return User.findAll();
        },
        matrix(root, args) {
            return Matrix.find({ where: args });
        },
        category(root, args) {
            return Category.find({ where: args });
        },
        alternative(root, args) {
            return Alternative.find({ where: args });
        },
        entry(root, args) {
            return Entry.find({ where: args });
        }
    },
    Matrix: {
        creator(matrix) {
            return matrix.creator;
        },
        categories(matrix) {
            return matrix.categories;
        },
        alternatives(matrix) {
            return matrix.alternatives;
        }
    },
    Category: {
        creator(category) {
            return category.creator;
        }
    },
    Alternative: {
        creator(alternative) {
            return alternative.creator;
        }
    },
    Entry: {
        author(entry) {
            return entry.author;
        },
        category(entry) {
            return entry.category;
        },
        alternative(entry) {
            return entry.alternative;
        }
    }
};

export default resolvers;
