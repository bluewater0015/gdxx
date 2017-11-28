
//form_image.js
import './form_image.css';
import React,{ Component } from 'react';
import Dropzone from 'react-dropzone';
import closeImg from './images/close1.png';
export default class FormImage extends Component{
	constructor(props){
		super(props);
		//console.log('11',this.props);
		this.state ={
			form:{
				name: '',
				files: []
			},
		}
	}
	componentDidMount() {
		//标示第一次加载
		this.first = true;
		//console.log('distributeImages',this.props.distributeImages);
		// setTimeout(()=>{
		// 	//console.log('distributeImages',this.props.distributeImages);
		// 	let distributeImages = this.props.distributeImages;
		// 	if(distributeImages) {
		// 		this.setState({
		// 			...this.state, form: {
		// 		        ...this.state.form,
		// 		        files: distributeImages
		// 		    }
		// 		})
		// 	}else {
		// 		this.setState({
		// 			...this.state, form: {
		// 		        ...this.state.form,
		// 		        files: []
		// 		    }
		// 		})
		// 	}
		// },500)
	}
	
	componentWillReceiveProps(props) {
		//console.log('props',props);
		//console.log(1);
		let distributeImages = props.distributeImages;
		//没有上传图片时，就拿到后台给的图片
		//上传图片了，isget就变为false，就不会执行下面

		if(distributeImages && distributeImages.length && !this.isget && this.first) {
			//第一次接受父组件传过来的值，之后就不再执行
			this.first = false;
			this.setState({
				...this.state, form: {
			        ...this.state.form,
			        files: this.state.form.files.concat(distributeImages)
			    }
			})
		}
		
	
	}
	// handleNameChange(e) {
	// 	this.setState({
	// 		...this.state,
	// 		form: {
	// 			...this.state.form,
	// 			name: e.target.value
	// 		}
	// 	})
	// }

	//提交
	// handleSubmit() {
	//     let formData = new FormData();
	//     formData.append("name", this.state.form.name)
	//     this.state.form.files.forEach(f =>
	//       formData.append("file", f)
	//     )

	//     fetch('/users', {
	//       method: 'POST',
	//       body: formData
	//     })
	// }

	//移除图片
	handleRemoveFile(file) {
	    this.setState({
	      ...this.state, form: {
	        ...this.state.form, 
	        files: this.state.form.files.filter(f => f != file)
	      }
	    },()=>{
	    	this.props.getDelete && this.props.getDelete(this.state.form.files);
	    });
	    console.log('handleRemoveFile',this.state.form.files.length);
	}
	//
	onDrop(acceptedFiles, rejectedFiles) {
		//标志，如果上传图片就为true
		this.isget = true;
		//console.log('acceptedFiles',acceptedFiles);
		let _this = this;

		(this.state.form.files.length + acceptedFiles.length <= 8) && this.props.getfiles && this.props.getfiles(acceptedFiles, rejectedFiles);

	    (this.state.form.files.length + acceptedFiles.length <= 8) && delay();
	    function delay(){
	    	setTimeout(dealFile,1000)
	    }
	    function dealFile() {
	    	console.log("dealFiles",acceptedFiles);
	    	_this.setState({
		      form:{
		      	files: _this.state.form.files.concat(acceptedFiles)
		      }
		    });
	    }
	    
	}
	
	render(){
		//console.log('ss',this.props.distributeImages);
		return (
			<div className="form_image">
				<form
					className="flex">
					{/*
					<input type="file" value={this.state.form.name}
					name="name"
					onChange={e => this.handleNameChange(e)} multiple/>
					*/}
          			<div className="flex-start center">
          				{this.props.imgName}
          			</div>
          			<Dropzone onDrop={this.onDrop.bind(this)} className="flex-start align-items" style={{width:' 100px',height: '30px',color: 'blue'}}>
            			上传图片
          			</Dropzone>
        		</form>
       			<ul className="image_container clearfix">
	            	{
	              		this.state.form.files.map((f,index) => 
		              		<div className="img_box float-left" style={{ width:'85px',height:'85px'}} key={index}>
		              			<img className="images" height={90} width={90} src={f.preview || f.url || f}/>
			              		<p className="img-close" onClick={this.handleRemoveFile.bind(this, f)}>
			              			<img src={ closeImg } />
			              		</p>
		              		</div>
	              		)
	            	}
	          	</ul>
	          {/*
	          	<div onClick={()=>this.handleSubmit()}>
	          		提交
	          	</div>
	          */}
			</div>
		)
	}
}