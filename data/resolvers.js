import { Matrix, Category, Alternative, Entry } from './connectors';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { Types } from "mongoose";

const pubsub = new PubSub();

const MATRIX_CHANGED_TOPIC = 'matrix_changed';
const ALTERNATIVE_CHANGED_TOPIC = 'alternative_changed';
const CATEGORY_CHANGED_TOPIC = 'category_changed';
const ENTRY_CHANGED_TOPIC = 'entry_changed';

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
                if (err) console.error('Error on Matrix save!');
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
                if (err) console.error('Error on Matrix deletion!');
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
                    description: args.description,
                    sorting: args.sorting,
                    weight: args.weight,
                    matrix: Types.ObjectId(categoryMatrix._id)
                });
                newCategory.save(function (err) {
                    if (err) console.error('Error on Category save!');
                }).then(function () {
                    categoryMatrix.categories.push(Types.ObjectId(newCategory._id));
                    categoryMatrix.save(function(err) {
                        if (err) console.error('Error on saving category at matrix\n' + err);
                    });
                    Category.find({}, function (err, items) {
                        pubsub.publish(CATEGORY_CHANGED_TOPIC, { categoriesChange: items });
                        Matrix.findById(args.matrixID).populate('categories').populate('alternatives').exec(
                            function (err, matrix) {
                                if (err) return console.error(err);
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
                if (err) console.error('Error on Category deletion!');
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
            return Matrix.findById(args.matrixID, function (err, matrix) {
                alternativeMatrix = matrix;
            }).then(function () {
                newAlternative = new Alternative({
                    title: args.title,
                    description: args.description,
                    sorting: args.sorting,
                    matrix: Types.ObjectId(alternativeMatrix._id)
                });
                newAlternative.save(function (err) {
                    if (err) console.error('Error on Alternative save!');
                }).then(function () {
                    alternativeMatrix.alternatives.push(Types.ObjectId(newAlternative._id));
                    alternativeMatrix.save(function(err) {
                        if (err) console.error('Error on saving alternative at matrix\n' + err);
                    });
                    Alternative.find({}, function (err, items) {
                        pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativesChange: items });
                        Matrix.findById(args.matrixID).populate('categories').populate('alternatives').exec(
                            function (err, matrix) {
                                if (err) return console.error(err);
                                pubsub.publish(MATRIX_CHANGED_TOPIC, { matrixChange: [matrix] });
                            }
                        )
                    })
                });
                return newAlternative;
            });
        },
        deleteAlternative: (root, args) => {
            Alternative.findByIdAndRemove(args.id, function (err) {
                if (err) console.error('Error on Alternative deletion!');
                return false;
            }).then(function () {
                Alternative.find({}, function (err, items) {
                    pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativesChange: items });
                })
            });
            return true;
        },
        createEntry: (root, args) => {
            let newEntry = null;
            let entryCategory = null;
            let entryAlternative = null;
            return Category.findById(args.categoryID, function (err, category) {
                entryCategory = category;
            }).then(function () {
                return Alternative.findById(args.alternativeID, function (err, alternative) {
                    entryAlternative = alternative;
                }).then(function () {
                    newEntry = new Entry({
                        value: args.value,
                        comment: args.comment,
                        category: Types.ObjectId(entryCategory._id),
                        alternative: Types.ObjectId(entryAlternative._id)
                    });
                    newEntry.save(function (err) {
                        if (err) console.error('Error on Alternative save!');
                    }).then(function () {
                        entryAlternative.entries.push(Types.ObjectId(newEntry._id));
                        entryAlternative.save(function(err) {
                            if (err) console.error('Error on saving entry at alternative\n' + err);
                        });
                        Entry.find({}, function (err, items) {
                            pubsub.publish(ENTRY_CHANGED_TOPIC, { entriesChange: items });
                            Alternative.findById(args.alternativeID).populate('entries').exec(
                                function (err, alternative) {
                                    if (err) return console.error(err);
                                    pubsub.publish(ALTERNATIVE_CHANGED_TOPIC, { alternativesChange: [alternative] });
                                }
                            )
                        });
                        entryCategory.entries.push(Types.ObjectId(newEntry._id));
                        entryCategory.save(function(err) {
                            if (err) console.error('Error on saving entry at category\n' + err);
                        });
                        Entry.find({}, function (err, items) {
                            pubsub.publish(ENTRY_CHANGED_TOPIC, { entriesChange: items });
                            Category.findById(args.categoryID).populate('entries').exec(
                                function (err, category) {
                                    if (err) return console.error(err);
                                    pubsub.publish(CATEGORY_CHANGED_TOPIC, { categoriesChange: [category] });
                                }
                            )
                        })
                    });
                    return newEntry;
                });
            });
        },
        deleteEntry: (root, args) => {
            Entry.findByIdAndRemove(args.id, function (err) {
                if (err) console.error('Error on Entry deletion!');
                return false;
            }).then(function () {
                Entry.find({}, function (err, items) {
                    pubsub.publish(ENTRY_CHANGED_TOPIC, { entriesChange: items });
                })
            });
            return true;
        },
        deleteAllEntries: (root, args) => {
            Entry.findOneAndRemove({}, function (err) {
                if (err) console.error('Error on Entry deletion!');
                return false;
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
        },
        entriesChange: {
            subscribe: () => pubsub.asyncIterator(ENTRY_CHANGED_TOPIC)
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
