import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PERSON_WITH_CARS } from '../graphql/queries';
import CarCard from '../components/CarCard';

const PersonShowPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const person = data?.person;
  const cars = data?.carsByPerson;

  if (!person) {
    return <p>Person not found</p>;
  }

  return (
    <div>
      <h2>{person.firstName} {person.lastName}</h2>
      <h3>Cars:</h3>
      {cars && cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default PersonShowPage;
