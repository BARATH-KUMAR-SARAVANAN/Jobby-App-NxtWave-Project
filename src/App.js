import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Home from './Component/Home'
import ProtectedRoute from './Component/ProtectedRoute'
import Jobs from './Component/Jobs'
import Login from './Component/Login'
import React from 'react'
import NotFound from './Component/NotFound'
import JobDescription from './Component/JobDescription'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobDescription} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
