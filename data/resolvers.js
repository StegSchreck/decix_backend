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
    Mutation: {
        createMatrix: (root, args) => {
            let newMatrix = new Matrix({
                title: args.title
            });
            newMatrix.save(function (err) {
                if (err) console.log ('Error on Matrix save!');
            });
            return newMatrix;
        },
        deleteMatrix: (root, args) => {
            Matrix.findOneAndRemove(args, function (err) {
                if (err) console.log ('Error on Matrix deletion!');
            });
            return true;
        },
        createCategory: (root, args) => {
            let newCategory = new Category({
                title: args.title,
                sorting: args.sorting
            });
            newCategory.save(function (err) {
                if (err) console.log ('Error on Category save!');
            });
            return newCategory;
        },
        deleteCategory: (root, args) => {
            Category.findOneAndRemove(args, function (err) {
                if (err) console.log ('Error on Category deletion!');
            });
            return true;
        },
        createAlternative: (root, args) => {
            let newAlternative = new Alternative({
                title: args.title,
                sorting: args.sorting
            });
            newAlternative.save(function (err) {
                if (err) console.log ('Error on Alternative save!');
            });
            return newAlternative;
        },
        deleteAlternative: (root, args) => {
            Alternative.findOneAndRemove(args, function (err) {
                if (err) console.log ('Error on Alternative deletion!');
            });
            return true;
        },
    },
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
