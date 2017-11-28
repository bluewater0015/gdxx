//title.js
import React,{ Component } from 'react';
import './title.css';
export default class Title extends Component{
	constructor(props){
		super(props);
		this.state ={
			
		}
	}
	
	render(){
		return (
			<div className="title center font_color">
				<p  style={ this.props.style }>{ this.props.title }</p>
			</div>
		)
	}
}