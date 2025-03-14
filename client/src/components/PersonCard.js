import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PEOPLE, GET_CARS_BY_PERSON } from '../graphql/queries';
import CarCard from './CarCard';
import CarForm from './CarForm';
import PersonForm from './PersonForm';
//import { UPDATE_CAR, REMOVE_CAR } from '../graphql/mutations';
import { REMOVE_PERSON } from '../graphql/mutations';
import './PersonCard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import Font Awesome CSS


const PersonCard = ({ person }) => {
  const [editing, setEditing] = useState(false);
  const [addingCar, setAddingCar] = useState(false);
  const { loading, error, data } = useQuery(GET_CARS_BY_PERSON, {
    variables: { personId: person.id },
  });
  const [removePerson] = useMutation(REMOVE_PERSON, {
    update(cache, { data: { removePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: people.filter(p => p.id !== removePerson) },
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      removePerson: person.id
    }
  });

  const handleRemove = () => {
    removePerson({
      variables: { id: person.id },
      update(cache) {
        cache.evict({ id: `Person:${person.id}` });
        cache.gc();
      }
    });
  };

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p>Error loading cars: {error.message}</p>;

  return (
    <div>
      <h3>
        {person.firstName} {person.lastName}
      </h3>
      <button onClick={() => setEditing(true)}><i className="fas fa-pencil-alt"></i></button>
      <button onClick={handleRemove}><i className="fas fa-trash-alt"></i></button>
      <Link to={`/people/${person.id}`}>Learn More</Link>

      {editing ? (
        <PersonForm person={person} onCancel={() => setEditing(false)} />
      ) : null}

      <h4>Cars:</h4>
      {data && data.carsByPerson.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
      <button onClick={() => setAddingCar(true)}>Add Car</button>
      {addingCar && (
        <CarForm personId={person.id} onCancel={() => setAddingCar(false)} />
      )}
    </div>
  );
};

export default PersonCard;
