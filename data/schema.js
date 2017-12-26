import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  user(firstName: String, lastName: String, email: String): User
  allUsers: [User]
  matrix(title: String): Matrix
  category(title: String): Category
  alternative(title: String): Alternative
  entry(title: String): Entry
}

type Mutation {
  addUser(firstName: String, lastName: String, email: String): User
}

type User {
  id: String
  firstName: String
  lastName: String
  email: String
}

type Matrix {
  id: String
  title: String
  creator: User
  categories: [Category]
  alternatives: [Alternative]
}

type Category {
  id: String
  title: String
  creator: User
  sorting: Int
  weight: Int
}

type Alternative {
  id: String
  title: String
  creator: User
  sorting: Int
}

type Entry {
  id: String
  value: String
  author: User
  category: Category
  alternative: Alternative
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
