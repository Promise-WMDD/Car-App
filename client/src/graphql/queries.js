import { gql } from '@apollo/client';

export const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_CARS_BY_PERSON = gql`
  query GetCarsByPerson($personId: ID!) {
    carsByPerson(personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const GET_PERSON_WITH_CARS = gql`
    query PersonWithCars($id: ID!) {
        person(id: $id) {
            id
            firstName
            lastName
            cars {
              id
              year
              make
              model
              price
            }
        }
      carsByPerson(personId: $id) {
        id
        year
        make
        model
        price
        personId
      }
    }
`;
