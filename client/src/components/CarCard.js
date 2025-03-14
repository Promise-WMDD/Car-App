import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_CAR, REMOVE_CAR } from '../graphql/mutations';
import CarForm from './CarForm';

const CarCard = ({ car }) => {
  const [editing, setEditing] = useState(false);
  const [removeCar] = useMutation(REMOVE_CAR, {
      update(cache, { data: { removeCar } }) {
          cache.evict({ id: `Car:${car.id}` });
          cache.gc();
      }
  });

  const handleRemove = () => {
    removeCar({
      variables: { id: car.id },
    });
  };

  return (
    <div>
      {car.year} {car.make} {car.model} - ${car.price}
      <button onClick={() => setEditing(true)}><i className="fas fa-pencil-alt"></i></button>
      <button onClick={handleRemove}><i className="fas fa-trash-alt"></i></button>

      {editing && (
        <CarForm car={car} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
};

export default CarCard;
