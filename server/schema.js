const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    person(id: ID!): Person
    cars: [Car]
    carsByPerson(personId: ID!): [Car]
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    removePerson(id: ID!): ID

    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    updateCar(id: ID!, year: Int, make: String, model: String, price: Float, personId: ID): Car
    removeCar(id: ID!): ID
  }
`;

module.exports = { typeDefs };
