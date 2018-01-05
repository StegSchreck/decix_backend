import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  matrix(id: String, title: String): [Matrix]
  category(id: String, title: String): [Category]
  alternative(id: String, title: String): [Alternative]
  entry(id: String, title: String): [Entry]
}

type Mutation {
  createMatrix(title: String): Matrix
  deleteMatrix(id: String): Boolean
  createCategory(title: String, sorting: Int): Category
  deleteCategory(id: String): Boolean
  createAlternative(title: String, sorting: Int): Alternative
  deleteAlternative(id: String): Boolean
}

type Matrix {
  id: String
  title: String
  categories: [Category]
  alternatives: [Alternative]
}

type Category {
  id: String
  title: String
  sorting: Int
  weight: Int
}

type Alternative {
  id: String
  title: String
  sorting: Int
}

type Entry {
  id: String
  value: String
  category: Category
  alternative: Alternative
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
