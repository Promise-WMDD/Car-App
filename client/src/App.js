import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import People from './components/People';
import PersonForm from './components/PersonForm';
import PersonShowPage from './pages/PersonShowPage';
import './App.css';  // Import global styles
import CarCard from './components/CarCard';
import CarForm from './components/CarForm';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="container">  {/* Wrap content in the container */}
          <h1>People and Their Cars</h1>
          <PersonForm />
          <CarForm/>
          <People />
          <Routes>
            <Route path="/people/:id" element={<PersonShowPage />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
