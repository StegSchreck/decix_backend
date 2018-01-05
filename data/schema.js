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
  createCategory(title: String, sorting: Int): Category
  deleteCategory(id: ID): Boolean
  createAlternative(title: String, sorting: Int): Alternative
  deleteAlternative(id: ID): Boolean
}

type Subscription {
  matrixAdded(title: String): Matrix
}

type Matrix {
  id: ID
  title: String
  categories: [Category]
  alternatives: [Alternative]
}

type Category {
  id: ID
  title: String
  sorting: Int
  weight: Int
}

type Alternative {
  id: ID
  title: String
  sorting: Int
}

type Entry {
  id: ID
  value: String
  category: Category
  alternative: Alternative
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
