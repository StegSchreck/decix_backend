import { User, Matrix, Category, Alternative, Entry } from './connectors';

const resolvers = {
    Query: {
        user(root, args) {
            return User.find(args);
        },
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
        addUser: (root, args) => {
            let newUser = new User ({
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
                password: args.password
            });
            newUser.save(function (err) {
                if (err) console.log ('Error on save!')
            });
            return newUser;
        },
        deleteUser: (root, args) => {
            let userToDelete = User.findOneAndRemove(args, function (err) {
                if (err) console.log ('Error on delete!')
            });
            return "deleted";
        },
        authenticateUser: (root, args) => {
            return User.findOne({'email':args.email}, function(err, user) {
                if (err) throw err;
                user.comparePassword(args.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) return user;
                    else return null;
                })
            })
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
