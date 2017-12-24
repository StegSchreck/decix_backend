import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  user(firstName: String, lastName: String): User
  allUsers: [User]
  matrix(title: String): Matrix
  category(title: String): Category
  alternative(title: String): Alternative
  entry(title: String): Entry
}

type User {
  id: Int
  firstName: String
  lastName: String
  email: String
}

type Matrix {
  id: Int
  title: String
  creator: User
  categories: [Category]
  alternatives: [Alternative]
}

type Category {
  id: Int
  title: String
  creator: User
  sorting: Int
  weight: Int
}

type Alternative {
  id: Int
  title: String
  creator: User
  sorting: Int
}

type Entry {
  id: Int
  value: String
  author: User
  category: Category
  alternative: Alternative
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
