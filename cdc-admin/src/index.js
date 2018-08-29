import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Home from './Home';
import AutorBox from './Autor';
import LivroBox from './Livro';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
    <Router> 
        <div>
            <App>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/autor" component={AutorBox}/>
                    <Route path="/home" component={LivroBox}/>
                </Switch>
            </App>
        </div>
    </Router>
);

ReactDOM.render(
    <Root/>, 
    document.getElementById('root')
);
registerServiceWorker();
