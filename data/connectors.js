var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const mongo = mongoose.connect('mongodb://localhost', {
    useMongoClient: true
});

const UserSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    creationDate: { type: Date, default: Date.now },
});

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