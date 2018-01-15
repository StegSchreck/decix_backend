import { Matrix, Category, Alternative, Entry } from './connectors';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { Types } from "mongoose";

const pubsub = new PubSub();

const MATRIX_CHANGED_TOPIC = 'matrix_changed';
const ALTERNATIVE_CHANGED_TOPIC = 'alternative_changed';
const CATEGORY_CHANGED_TOPIC = 'category_changed';

const resolvers = {
    Query: {
        matrix(root, args) {
            if (args.id !== undefined) {
                return [Matrix.findById(args.id).populate('categories').populate('alternatives')];
            }
            return Matrix.find(args).populate('categories').populate('alternatives');
        },
        category(root, args) {
            if (args.id !== undefined) {
                return [Category.findById(args.id).populate('matrix')];
            }
            return Category.find(args).populate('matrix');
        },
        alternative(root, args) {
            if (args.id !== undefined) {
                return [Alternative.findById(args.id).populate('matrix')];
            }
            return Alternative.find(args).populate('matrix');
        },
        entry(root, args) {
            if (args.id !== undefined) {
                return [Entry.findById(args.id).populate('category').populate('alternative')];
            }
            return Entry.find(args).populate('category').populate('alternative');
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
                    pubsub.publish(MATRIX_CHANGED_TOPIC, { matrixesChange: items });
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
                    pubsub.publish(MATRIX_CHANGED_TOPIC, { matrixesChange: items });
                })
            });
            return true;
        },
        createCategory: (root, args) => {
            let newCategory = null;
            let categoryMatrix = null;
            return Matrix.findById(args.matrixID, function (err, matrix) {
                categoryMatrix = matrix;
            }).then(function () {
                newCategory = new Category({
                    title: args.title,
                    sorting: args.sorting,
                    matrix: Types.ObjectId(categoryMatrix._id)
                });
                newCategory.save(function (err) {
                    if (err) console.log ('Error on Category save!');
                }).then(function () {
                    categoryMatrix.categories.push(Types.ObjectId(newCategory._id));
                    categoryMatrix.save(function(err) {
                        if (err) console.log('Error on saving category at matrix\n' + err);
                    });
                    Category.find({}, function (err, items) {
                        pubsub.publish(CATEGORY_CHANGED_TOPIC, { categoriesChange: items });
                        Matrix.findById(args.matrixID).populate('categories').populate('alternatives').exec(
                            function (err, matrix) {
                                if (err) return console.log(err);
                                pubsub.publish(MATRIX_CHANGED_TOPIC, { matrixChange: [matrix] });
                            }
                        )
                    })
                });
                return newCategory;
            });
        },
        deleteCategory: (root, args) => {
            Category.findByIdAndRemove(args.id, function (err) {
                if (err) console.log ('Error on Category deletion!');
                return false;
            }).then(function () {
                Category.find({}, function (err, items) {
                    pubsub.publish(CATEGORY_CHANGED_TOPIC, { categoriesChange: items });
                })
            });
            return true;
        },
        createAlternative: (root, args) => {
            let newAlternative = null;
            let alternativeMatrix = null;
            Matrix.findById(args.matrixID, function (err, matrix) {
                alternativeMatrix = matrix;
            }).then(function () {
                newAlternative = new Alternative({
                    title: args.title,
                    sorting: args.sorting,
                    matrix: Types.ObjectId(alternativeMatrix._id)
                });
                newAlternative.save(function (err) {
                    if (err) console.log ('Error on Alternative save!');
                }).then(function () {
                    alternativeMatrix.alternatives.push(Types.ObjectId(newAlternative._id));
                    alternativeMatrix.save(function(err) {
                        if (err) console.log('Error on saving alternative at matrix\n' + err);
                    });
                    Alternative.find({}, function (err, items) {
                        pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativesChange: items });
                    })
                });
                return newAlternative;
            });
        },
        deleteAlternative: (root, args) => {
            Alternative.findByIdAndRemove(args.id, function (err) {
                if (err) console.log ('Error on Alternative deletion!');
                return false;
            }).then(function () {
                Alternative.find({}, function (err, items) {
                    pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativesChange: items });
                })
            });
            return true;
        },
    },
    Subscription: {
        matrixesChange: {
            subscribe: () => pubsub.asyncIterator(MATRIX_CHANGED_TOPIC)
        },
        matrixChange: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(MATRIX_CHANGED_TOPIC),
                (payload, variables) => payload.matrixChange[0]._id.toString() === variables.id.toString()
            )
        },
        categoriesChange: {
            subscribe: () => pubsub.asyncIterator(CATEGORY_CHANGED_TOPIC)
        },
        alternativesChange: {
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
        },
        matrix(alternative) {
            return alternative.matrix;
        }
    },
    Alternative: {
        entries(alternative) {
            return alternative.entries;
        },
        matrix(alternative) {
            return alternative.matrix;
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
