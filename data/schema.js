import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  matrix(id: ID, title: String): [Matrix]
  category(id: ID, title: String): [Category]
  alternative(id: ID, title: String): [Alternative]
  entry(id: ID, title: String): [Entry]
}

type Mutation {
  createMatrix(title: String): Matrix
  deleteMatrix(id: ID): Boolean
  createCategory(title: String, description: String, sorting: Int, weight: Int, matrixID: ID): Category
  deleteCategory(id: ID): Boolean
  createAlternative(title: String, description: String, sorting: Int, matrixID: ID): Alternative
  deleteAlternative(id: ID): Boolean
  createEntry(value: String, comment: String, categoryID: ID, alternativeID: ID): Entry
  deleteEntry(id: ID): Boolean
  deleteAllEntries: Boolean
}

type Subscription {
  matrixesChange: [Matrix]
  matrixChange(id: ID): [Matrix]
  categoriesChange: [Category]
  alternativesChange: [Alternative]
  entriesChange: [Entry]
}

type Matrix {
  id: ID
  title: String
  description: String
  categories: [Category]
  alternatives: [Alternative]
}

type Category {
  id: ID
  title: String
  description: String
  sorting: Int
  weight: Int
  entries: [Entry]
  matrix: Matrix
}

type Alternative {
  id: ID
  title: String
  description: String
  sorting: Int
  entries: [Entry]
  matrix: Matrix
}

type Entry {
  id: ID
  value: String
  comment: String
  category: Category
  alternative: Alternative
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
