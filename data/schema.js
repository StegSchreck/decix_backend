import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  matrix(title: String): [Matrix]
  category(title: String): [Category]
  alternative(title: String): [Alternative]
  entry(title: String): [Entry]
}

type Mutation {
  createMatrix(title: String): Matrix
  deleteMatrix(id: String): Boolean
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
