let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const mongo = mongoose.connect('mongodb://localhost', {
    useMongoClient: true
});

const MatrixSchema = Schema({
    title: { type: String, index: { unique: true } },
    description: String,
    categories: [{ type: Schema.ObjectId, ref: 'Category' }],
    alternatives: [{ type: Schema.ObjectId, ref: 'Alternative' }],
    creationDate: { type: Date, default: Date.now },
});
const Matrix = mongoose.model('Matrix', MatrixSchema);

const CategorySchema = Schema({
    title: String,
    description: String,
    sorting: { type: Number, min: 0 },
    weight: { type: Number, default: 0 },
    entries: [{ type: Schema.ObjectId, ref: 'Entry' }],
    matrix: { type: Schema.ObjectId, ref: 'Matrix' },
    creationDate: { type: Date, default: Date.now },
});
CategorySchema.index({ matrix: 1, title: 1 }, { unique: true });
CategorySchema.index({ matrix: 1, sorting: 1 }, { unique: true });
const Category = mongoose.model('Category', CategorySchema);

const AlternativeSchema = Schema({
    title: String,
    description: String,
    sorting: { type: Number, min: 0 },
    entries: [{ type: Schema.ObjectId, ref: 'Entry' }],
    matrix: { type: Schema.ObjectId, ref: 'Matrix' },
    creationDate: { type: Date, default: Date.now },
});
AlternativeSchema.index({ matrix: 1, title: 1 }, { unique: true });
AlternativeSchema.index({ matrix: 1, sorting: 1 }, { unique: true });
const Alternative = mongoose.model('Alternative', AlternativeSchema);

const EntrySchema = Schema({
    value: String,
    comment: String,
    alternative: { type: Schema.Types.ObjectId, ref: 'Alternative' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    creationDate: { type: Date, default: Date.now },
});
EntrySchema.index({ alternative: 1, category: 1 }, { unique: true });
const Entry = mongoose.model('Entry', EntrySchema);

export { Matrix, Category, Alternative, Entry };
