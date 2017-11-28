//no_order.js
import './no_order.css';
import React,{ Component } from 'react';

export default class NoOrder extends Component{
	constructor(props){
		super(props);
		this.state ={
			
		}
	}
	componentDidMount() {
		document.title = "我的工单";
	}
	render(){
		return (
			<div className="no_order flex flex-direction">
				<div className="content center flex1">
					暂无工单
				</div>
				<div className="my_order center">
					我的工单
				</div>
			</div>
		)
	}
}