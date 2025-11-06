import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route>404 - Not Found</Route>
    </Switch>
  );
}

export default App;
