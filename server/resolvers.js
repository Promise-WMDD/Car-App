const { v4: uuidv4 } = require('uuid');

let people = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates'
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs'
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds'
  }
];

let cars = [
  {
    id: '1',
    year: 2019,
    make: 'Toyota',
    model: 'Corolla',
    price: 40000,
    personId: '1'
  },
  {
    id: '2',
    year: 2018,
    make: 'Lexus',
    model: 'LX 600',
    price: 13000,
    personId: '1'
  },
  {
    id: '3',
    year: 2017,
    make: 'Honda',
    model: 'Civic',
    price: 20000,
    personId: '1'
  },
  {
    id: '4',
    year: 2019,
    make: 'Acura ',
    model: 'MDX',
    price: 60000,
    personId: '2'
  },
  {
    id: '5',
    year: 2018,
    make: 'Ford',
    model: 'Focus',
    price: 35000,
    personId: '2'
  },
  {
    id: '6',
    year: 2017,
    make: 'Honda',
    model: 'Pilot',
    price: 45000,
    personId: '2'
  },
  {
    id: '7',
    year: 2019,
    make: 'Volkswagen',
    model: 'Golf',
    price: 40000,
    personId: '3'
  },
  {
    id: '8',
    year: 2018,
    make: 'Kia',
    model: 'Sorento',
    price: 45000,
    personId: '3'
  },
  {
    id: '9',
    year: 2017,
    make: 'Volvo',
    model: 'XC40',
    price: 55000,
    personId: '3'
  }
];

const resolvers = {
  Query: {
    people: () => people,
    person: (root, args) => people.find(person => person.id === args.id),
    cars: () => cars,
    carsByPerson: (root, args) => cars.filter(car => car.personId === args.personId),
  },
  Mutation: {
    addPerson: (root, args) => {
      const newPerson = { id: uuidv4(), firstName: args.firstName, lastName: args.lastName };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (root, args) => {
      const person = people.find(person => person.id === args.id);
      if (!person) {
        throw new Error(`Couldn't find person with id ${args.id}`);
      }
      person.firstName = args.firstName !== undefined ? args.firstName : person.firstName;
      person.lastName = args.lastName !== undefined ? args.lastName : person.lastName;
      return person;
    },
    removePerson: (root, args) => {
      const personIndex = people.findIndex(person => person.id === args.id);
      if (personIndex === -1) {
        throw new Error(`Couldn't find person with id ${args.id}`);
      }
      const removedPersonId = people[personIndex].id;
      people.splice(personIndex, 1);
      cars = cars.filter(car => car.personId !== args.id);
      return removedPersonId;
    },
    addCar: (root, args) => {
      const newCar = { id: uuidv4(), year: args.year, make: args.make, model: args.model, price: args.price, personId: args.personId };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (root, args) => {
      const car = cars.find(car => car.id === args.id);
      if (!car) {
        throw new Error(`Couldn't find car with id ${args.id}`);
      }
      car.year = args.year !== undefined ? args.year : car.year;
      car.make = args.make !== undefined ? args.make : car.make;
      car.model = args.model !== undefined ? args.model : car.model;
      car.price = args.price !== undefined ? args.price : car.price;
      car.personId = args.personId !== undefined ? args.personId : car.personId;
      return car;
    },
    removeCar: (root, args) => {
      const carIndex = cars.findIndex(car => car.id === args.id);
      if (carIndex === -1) {
        throw new Error(`Couldn't find car with id ${args.id}`);
      }
      const removedCarId = cars[carIndex].id;
      cars.splice(carIndex, 1);
      return removedCarId;
    },
  },
};

module.exports = { resolvers };
