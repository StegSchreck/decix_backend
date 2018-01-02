var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

mongoose.Promise = global.Promise;

const mongo = mongoose.connect('mongodb://localhost', {
    useMongoClient: true
});

const MatrixSchema = Schema({
    title: String,
    categories: [{ type: Schema.ObjectId, ref: 'Category' }],
    alternatives: [{ type: Schema.ObjectId, ref: 'Alternative' }],
    creationDate: { type: Date, default: Date.now },
});

const Matrix = mongoose.model('Matrix', MatrixSchema);

const CategorySchema = Schema({
    title: String,
    sorting: Number,
    weight: Number,
    creationDate: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', CategorySchema);

const AlternativeSchema = Schema({
    title: String,
    sorting: Number,
    creationDate: { type: Date, default: Date.now },
});

const Alternative = mongoose.model('Alternative', AlternativeSchema);

const EntrySchema = Schema({
    value: String,
    alternative: { type: Schema.Types.ObjectId, ref: 'Alternative' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    creationDate: { type: Date, default: Date.now },
});

const Entry = mongoose.model('Entry', EntrySchema);

export { Matrix, Category, Alternative, Entry };
