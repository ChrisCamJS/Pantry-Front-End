import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import RecipeDetails from './pages/RecipeDetails';
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Layout>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/recipe/:id' element={<RecipeDetails />} />
              <Route path='/admin' element={<AdminDashboard />} />
            </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
