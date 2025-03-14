import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PEOPLE } from '../graphql/queries';
import PersonCard from './PersonCard';
import { UPDATE_CAR, REMOVE_CAR } from '../graphql/mutations';
import './People.css';
const People = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
        <h2 className='recs'>Records</h2>
      {data.people.map(person => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
};

export default People;
