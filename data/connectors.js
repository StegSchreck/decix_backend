var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

mongoose.Promise = global.Promise;

const mongo = mongoose.connect('mongodb://localhost', {
    useMongoClient: true
});

const UserSchema = Schema({
    firstName: String,
    lastName: String,
    email: { type: String, lowercase: true, required: true, index: { unique: true } },
    password: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
}, { runSettersOnQuery: true });

UserSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);

const MatrixSchema = Schema({
    title: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    categories: [{ type: Schema.ObjectId, ref: 'Category' }],
    alternatives: [{ type: Schema.ObjectId, ref: 'Alternative' }],
    creationDate: { type: Date, default: Date.now },
});

const Matrix = mongoose.model('Matrix', MatrixSchema);

const CategorySchema = Schema({
    title: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    sorting: Number,
    weight: Number,
    creationDate: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', CategorySchema);

const AlternativeSchema = Schema({
    title: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    sorting: Number,
    creationDate: { type: Date, default: Date.now },
});

const Alternative = mongoose.model('Alternative', AlternativeSchema);

const EntrySchema = Schema({
    value: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    alternative: { type: Schema.Types.ObjectId, ref: 'Alternative' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    creationDate: { type: Date, default: Date.now },
});

const Entry = mongoose.model('Entry', EntrySchema);

export { User, Matrix, Category, Alternative, Entry };