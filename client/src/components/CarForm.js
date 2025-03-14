import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS_BY_PERSON, GET_PEOPLE } from '../graphql/queries';
import { ADD_CAR, UPDATE_CAR, REMOVE_CAR } from '../graphql/mutations';

const CarForm = ({ car, personId: initialPersonId, onCancel }) => {
  const [year, setYear] = useState(car ? car.year : '');
  const [make, setMake] = useState(car ? car.make : '');
  const [model, setModel] = useState(car ? car.model : '');
  const [price, setPrice] = useState(car ? car.price : '');
  const [personId, setPersonId] = useState(initialPersonId || (car ? car.personId : ''));

  const { loading, error, data } = useQuery(GET_PEOPLE);
  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      const existingCars = cache.readQuery({
        query: GET_CARS_BY_PERSON,
        variables: { personId: addCar.personId },
      });
      const newCars = existingCars
        ? existingCars.carsByPerson.concat([addCar])
        : [addCar];
      cache.writeQuery({
        query: GET_CARS_BY_PERSON,
        variables: { personId: addCar.personId },
        data: { carsByPerson: newCars },
      });
    },
  });

  const [updateCar] = useMutation(UPDATE_CAR);

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = {
      year: parseInt(year),
      make,
      model,
      price: parseFloat(price),
      personId,
    };
    if (car) {
      updateCar({
        variables: { id: car.id, ...variables },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCar: { ...car, ...variables, __typename: 'Car' },
        },
      });
    } else {
      addCar({
        variables,
        optimisticResponse: {
          __typename: 'Mutation',
          addCar: {
            id: "optimistic-car-" + Date.now(),
            year: parseInt(year),
            make,
            model,
            price: parseFloat(price),
            personId,
            __typename: 'Car'
          }
        },
      });
    }
    if (onCancel) onCancel();
    setYear('');
    setMake('');
    setModel('');
    setPrice('');
    setPersonId('');
  };

  if (loading) return <p>Loading people...</p>;
  if (error) return <p>Error loading people: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
        <h2>Add Car</h2>
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={e => setYear(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Make"
        value={make}
        onChange={e => setMake(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={model}
        onChange={e => setModel(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
      />
      <select value={personId} onChange={e => setPersonId(e.target.value)} required>
        <option value="">Select a person</option>
        {data.people.map(person => (
          <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </option>
        ))}
      </select>
      <button type="submit">{car ? 'Update' : 'Add'} Car</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default CarForm;
