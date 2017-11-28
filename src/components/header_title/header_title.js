
//header_title.js
import './header_title.css';
import React,{ Component } from 'react';

export default class HeaderTitle extends Component{
	constructor(props){
		super(props);
		this.state ={
			
		}
	}
	render(){
		return (
			<div className="header_title flex">
				<div className="flex-start flex1">
					<p className="center">{ this.props.createMessage}</p>
				</div>
				<div className="flex-end flex1">
					<p className="center">{ this.props.typeName}</p>
				</div>
			</div>
		)
	}
}