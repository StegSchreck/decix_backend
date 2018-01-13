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
  createCategory(title: String, sorting: Int, matrixID: ID): Category
  deleteCategory(id: ID): Boolean
  createAlternative(title: String, sorting: Int): Alternative
  deleteAlternative(id: ID): Boolean
}

type Subscription {
  matrixChange: [Matrix]
  categoryChange: [Category]
  alternativeChange: [Alternative]
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
