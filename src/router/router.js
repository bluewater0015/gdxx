//router.js
import React,{ Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import createBrowserHistory from 'history';
import Login from '../pages/login/login';
import Owner from '../pages/owner_order/owner_order';
import Distribute from '../pages/distribute_detail/distribute_detail';
import Execute from '../pages/execute_detail/execute_detail';
import Complete from '../pages/complete_order/complete_order';
import NoOrder from '../pages/no_order/no_order';
import NoFound from '../pages/nofound/nofound';


const history = createBrowserHistory;
export default class RouterMap extends Component{
	constructor(props){
		super(props);
		this.state = {
			
		}
	}
	render(){
		return (
			<Router history={ history } >
				<Switch style={{ width: '100%',height: '100%'}}>
					<Route exact path="/" component={ Login } />
					<Route path="/owner" component={ Owner } />
					<Route path="/distribute/:id" component={ Distribute } />
					<Route path="/execute/:id" component={ Execute } />
					<Route path="/complete/:id" component={ Complete } />
					<Route path="/noorder" component= { NoOrder } />
					<Route component={ NoFound } />
				</Switch>
			</Router>
		)
	}
}
