import { Matrix, Category, Alternative, Entry } from './connectors';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const MATRIX_CHANGED_TOPIC = 'matrix_changed';
const ALTERNATIVE_CHANGED_TOPIC = 'alternative_changed';
const CATEGORY_CHANGED_TOPIC = 'category_changed';

const resolvers = {
    Query: {
        matrix(root, args) {
            if (args.id !== undefined) {
                return [Matrix.findById(args.id)];
            }
            return Matrix.find(args);
        },
        category(root, args) {
            if (args.id !== undefined) {
                return [Category.findById(args.id)];
            }
            return Category.find(args);
        },
        alternative(root, args) {
            if (args.id !== undefined) {
                return [Alternative.findById(args.id)];
            }
            return Alternative.find(args);
        },
        entry(root, args) {
            if (args.id !== undefined) {
                return [Entry.findById(args.id)];
            }
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
                return null;
            }).then(function () {
                    Matrix.find({}, function (err, items) {
                        pubsub.publish(MATRIX_CHANGED_TOPIC, { matrixChange: items });
                    })
            });
            return newMatrix;
        },
        deleteMatrix: (root, args) => {
            Matrix.findByIdAndRemove(args.id, function (err) {
                if (err) console.log ('Error on Matrix deletion!');
                return false;
            }).then(function () {
                Matrix.find({}, function (err, items) {
                    pubsub.publish(MATRIX_CHANGED_TOPIC, { matrixChange: items });
                })
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
                return null;
            }).then(function () {
                Category.find({}, function (err, items) {
                    pubsub.publish(CATEGORY_CHANGED_TOPIC, { categoryChange: items });
                })
            });
            return newCategory;
        },
        deleteCategory: (root, args) => {
            Category.findByIdAndRemove(args.id, function (err) {
                if (err) console.log ('Error on Category deletion!');
                return false;
            }).then(function () {
                Category.find({}, function (err, items) {
                    pubsub.publish(CATEGORY_CHANGED_TOPIC, { categoryChange: items });
                })
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
                return null;
            }).then(function () {
                Alternative.find({}, function (err, items) {
                    pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativeChange: items });
                })
            });
            return newAlternative;
        },
        deleteAlternative: (root, args) => {
            Alternative.findByIdAndRemove(args.id, function (err) {
                if (err) console.log ('Error on Alternative deletion!');
                return false;
            }).then(function () {
                Alternative.find({}, function (err, items) {
                    pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativeChange: items });
                })
            });
            return true;
        },
    },
    Subscription: {
        matrixChange: {
            subscribe: () => pubsub.asyncIterator(MATRIX_CHANGED_TOPIC)
        },
        categoryChange: {
            subscribe: () => pubsub.asyncIterator(CATEGORY_CHANGED_TOPIC)
        },
        alternativeChange: {
            subscribe: () => pubsub.asyncIterator(ALTERNATIVE_CHANGED_TOPIC)
        }
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
        entries(category) {
            return category.entries;
        }
    },
    Alternative: {
        entries(alternative) {
            return alternative.entries;
        }
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
