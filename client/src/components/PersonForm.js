import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_PEOPLE } from '../graphql/queries';
//import { UPDATE_CAR, REMOVE_CAR } from '../graphql/mutations';
import { ADD_PERSON, UPDATE_PERSON } from '../graphql/mutations';
import './PersonForm.css'; // Import the CSS

const PersonForm = ({ person, onCancel }) => {
  const [firstName, setFirstName] = useState(person ? person.firstName : '');
  const [lastName, setLastName] = useState(person ? person.lastName : '');
  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data: { addPerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: people.concat([addPerson]) },
      });
    }
  });
  const [updatePerson] = useMutation(UPDATE_PERSON);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (person) {
      updatePerson({
        variables: { id: person.id, firstName, lastName },
        optimisticResponse: {
          __typename: 'Mutation',
          updatePerson: { ...person, firstName, lastName, __typename: 'Person' },
        },
        update(cache, { data: { updatePerson } }) {
          const { people } = cache.readQuery({ query: GET_PEOPLE });
          cache.writeQuery({
            query: GET_PEOPLE,
            data: { people: people.map(p => p.id === person.id ? updatePerson : p) },
          });
        }
      });
    } else {
      addPerson({
        variables: { firstName, lastName },
        optimisticResponse: {
          __typename: 'Mutation',
          addPerson: {
            id: "optimistic-id-" + Date.now(),
            firstName,
            lastName,
            __typename: 'Person'
          }
        },
      });
    }
    if (onCancel) onCancel();
    setFirstName('');
    setLastName('');
  };

  return (
    <form onSubmit={handleSubmit}>
        <h2>Add Person</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        required
      />
      <button type="submit">{person ? 'Update' : 'Add'} Person</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default PersonForm;
