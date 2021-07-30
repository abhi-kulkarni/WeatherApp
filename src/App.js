import logo from './logo.svg';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import DayDetails from './pages/DayDetails';

function App() {
  return (
    <div className="App">
       <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/:day' component={DayDetails} />
        </Switch>
    </div>
  );
}

export default App;
