
import './distribute_detail.css';
import React,{ Component } from 'react';
import HeaderTitle from '../../components/header_title/header_title';
import FormImage from '../../components/form_image/form_image';
import downImg from './images/down.png';
import loadImage from './images/load.gif';

export default class Distribute extends Component{
	constructor(props){
		super(props);
		this.state ={
			/**********创建信息***********/
			//机器码
			machineCode: '',
			//点位
			location: '',
			//地址
			address: '',
			//等级
			gread: '',
			//城市
			city: '',
			//类型
			type: '',
			//要求
			demand: '',
			//期待完成时间
			complete_time: '',
			//视频
			teachingVideo: '',
			//创建人
			createPerson: '',
			//创建时间
			createTime: '',
			//创建图片：
			createImages:[],
			//图片
			distributeImages:[],

			/**********派发信息***********/
			//计划执行人是否为空
			isPlanExecuteMan: false,
			//计划执行人
			distributeMan: '',
			//备注
			remark: '',

			//图片信息初始化
			form: {
				name: '',
				files: [] 
			},
			/**********各种弹出框***********/
			//确认弹出框
			confirmModel: false,
			//撤销弹出框
			cancelModel: false,
			//遮罩层
			shade: false,
			//计划执行人的下拉菜单
			menu: false,
			//是否确认
			isConfirmEvent: false,
			//当点击派发，计划人填写之后，按确认之后，模态框是否显示
			confirmTips: false,
		}
	}
	//加载待派发详情页面的数据
	fetchData(){
		let id = this.props.match.params.id;
		//console.log('id',id);
		let url = '/admin/workOrder/page/' + id;
		return fetch(url,{
			method: 'GET',
			headers: {
				'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			mode: 'cors'
		}).then(res=>{
			return res.json()
		}).then(data=>{
			console.log('distributeList',data);
			let complete_time =  this.format(data.expectedFinishDate);
			//创建时间处理
			let createTime = this.format(data.createDate);
			this.setState({
				//机器码
				machineCode: data.machine.sn,
				//位置
				location: data.machine.address.address,
				//地址
				address: data.machine.formattedAddress,
				//等级
				gread: data.workOrderLevelString,
				//城市
				city: data.city,
				//类型
				type: data.workOrderTypeString,
				//要求
				demand: data.demand,
				//完成时间
				complete_time: complete_time,
				//视频
				teachingVideo: data.teachingVideo,
				//创建人
				createPerson: data.createPerson.realname,
				//创建时间
				createTime: createTime,
				//工单状态
				workOrderStatusString: data.workOrderStatusString,
				//创建图片
				createImages: data.createImages
			})
		}).catch(err=>{
			console.log(err);
		})
	}
	componentDidMount() {
		document.title = '工单详情';
		//加载待派发详情页面的数据
		this.fetchData();
	}
	/*************调用接口函数*************/
	//点击派发按钮时，弹出一个框
	//点击确认按钮时，调用接口
	confirmEvent() {
		this.setState({
			confirmModel: false,
			confirmTips: true,
		})
		let id = this.props.match.params.id;
		//console.log('id',id);
		//获取用户id
		let adminId = localStorage.getItem('id');
		//console.log('adminId',adminId);
		//传基本参数的对象
		let param ={
			id: id,
			distributePersonId: adminId,
			//file:this.state.form.files,
			planExecutiveId: this.state.planExecutiveId,
			remark:  this.state.remark
		}

		//new一个formData对象
		let formData = new FormData();	    
	    this.state.form.files.forEach(f =>{
	      		formData.append("file", f)	    
	      	}
	    )

	    formData.append("workOrder", 
	    	new Blob([JSON.stringify(param)], {type:"application/json"}));
	    		    
	    console.log("formData1",formData);
		let url = '/admin/workOrder/page/distribute';
		return fetch(url,{
			method: 'PUT',
			headers: {
				'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
				// 'Accept': 'application/json',
				// 'Content-type': 'application/json',
				// 'Content-type': 'multipart/form-data'
			},
			body: formData,
			mode: 'cors'
		}).then(res=>{
			return res.json()
		}).then(data=>{
			console.log('派发',data);
			this.setState({
				shade: false,
				confirmModel: false,
				confirmTips: false,
			})
			if(data.createPerson.enabled){
				this.props.history.push('/owner');
			}
		}).catch(err=>{
			console.log(err);
		})

		//当确认时，遮罩层和弹出框消失
		// this.setState({
		// 	shade: false,
		// 	confirmModel: false
		// })
	}
	//点击计划执行人的下拉菜单
	downMenuEvent() {
		//从后台拿数据
		let url = '/admin/admin-workOrder';
		return fetch(url,{
			method: 'GET',
			headers: {
				'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			mode: 'cors'
		}).then(res=>{
			return res.json()
		}).then(data=>{
			console.log('计划执行人',data);
			this.setState({
				planManList: data.content,
				menu: !this.state.menu,
			})
		}).catch(err=>{
			console.log(err);
		})

		// this.setState({
		// 	menu: !this.state.menu
		// })
	}
	//撤销时的确认按钮，
	//点击确认撤销时，调用接口
	abolishConfirmEvent() {
		// console.log('点击撤销');
		let id = this.props.match.params.id;
		let adminId = parseInt(localStorage.getItem('id'));
		console.log('adminId',adminId);
		let url = '/admin/workOrder/page/cancel/' + id + '?adminId='+adminId ;
		return fetch(url,{
			method: 'PUT',
			headers: {
				'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			mode: 'cors'
		}).then(res=>{
			return res.json()
		}).then(data=>{
			console.log('撤销data',data);
			this.setState({
				shade: false,
				confirmModel: false,
				cancelModel: false,
			})
			if(data.createPerson.enabled){
				this.props.history.push('/owner');
			}
		}).catch(err=>{
			console.log(err);
		})
	}
	/**************公用函数**************/
	adds(m){
		return m < 10 ? '0' + m : m;
	}

	format(timeStamp){
		//timeStamp是整数，否则要parseInt转换
		var time = new Date(timeStamp);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		//var s = time.getSeconds()+1;
		return y+'.'+this.adds(m)+'.'+this.adds(d)+' '+this.adds(h)+':'+this.adds(mm);
	}
	/*************处理逻辑函数*************/
	//点击每个计划执行人
	planManEvent(index) {
		let planExecuteMan = this.state.planManList[index].realname;
		let  planExecutiveId = this.state.planManList[index].id;
		this.setState({
			planExecuteMan: planExecuteMan,
			planExecutiveId: planExecutiveId,
			menu: false,
		})
	}
	//处理备注框中多余的文字
	dealtextareaData(value) {
		if(value.length > 500){
			return value.substring(0,50);
		}
		return value;
	}
	//备注框输入文字时，获取值
	remarkChangeEvent(e) {
		//console.log('备注');
		//console.log(this.state.remark);
		let value = e.target.value;
		//console.log(value.length);
		this.setState({
			remark: this.dealtextareaData(value)
		})
	}
	//是否确认按钮
	isConfirmEvent() {
		this.setState({
			isConfirmEvent: true
		})
	}
	//点击派发按钮
	distributeEvent() {
		//console.log('点击派发');
	 	let planExecuteMan = this.state.planExecuteMan;
		//判断计划执行人是否为空
		if(planExecuteMan){
			this.setState({
				shade: true,
				confirmModel: true,
				cancelModel: false	
			})
		}else {
			this.setState({
				shade: true,
				isPlanExecuteMan: true
			})
		}
	}
	//计划执行人为空弹窗时的确认
	planModelConfirmEvent() {
		this.setState({
			shade: false,
			isPlanExecuteMan: false
		})
	}
	//确认时的取消按钮
	confirmCancelEvent() {
		this.setState({
			shade: false,
			confirmModel: false
		})
	}
	//点击撤销按钮
	cancelEvent() {
		this.setState({
			shade: true,
			cancelModel: true,
			confirmModel: false
		})
	}
	//撤销时的取消按钮
	abolishEvent() {
		this.setState({
			shade: false,
			confirmModel: false,
			cancelModel: false,
		})
	}
	//
	getfiles(acceptedFiles, rejectedFiles) {
		//console.log('acceptedFiles',acceptedFiles);
		this.setState({
	      ...this.state, form: {
	        ...this.state.form,
	        files: acceptedFiles
	      }
	    });
	}
	
	// getfiles(acceptedFiles, rejectedFiles) {
	// 	console.log('acceptedFiles',acceptedFiles);
	// 	this.setState({
	//       ...this.state, form: {
	//         ...this.state.form,
	//         files: acceptedFiles
	//       }
	//     });
	// }
	//展示遮罩层
	shadeShowModel() {
		return (
			<div className="shade">
			</div>
		)
	}
	//计划执行人为空时的提示弹出框
	planExecuteManShowModel() {
		return(
			<div className="planExecuteManModel">
				<div className="center">派发失败</div>
				<div className="center margin-bottom30">
					请检查计划执行人是否填写正确
				</div>
				<div className="flex">
					<div className="center flex1" onClick={()=>this.planModelConfirmEvent()}>
						<p className="border padding-left-right borderRadius4">确认</p>
					</div>
				</div>
			</div>
		)
	}
	//确认时的弹出框
	confirmShowModel(){
		return(
			<div className="confirmModel">
				<div className="center">
					工单将派发给
					<p>{ this.state.planExecuteMan }</p>
				</div>
				<div className="center margin-bottom30" onClick={this.isConfirmEvent.bind(this)}>
					是否确认？
				</div>
				<div className="flex">
					<div className="center flex1" onClick={()=>this.confirmEvent()}>
						<p className="border padding-left-right borderRadius4">确认</p>
					</div>
					<div className="center flex1" onClick={()=>this.confirmCancelEvent()}>
						<p className="border padding-left-right borderRadius4">取消</p>
					</div>
				</div>
			</div>
		)
	}
	//撤销时的弹出框
	cancelShowModel() {
		return(
			<div className="cancelModel">
				<div className="center">
					撤销后，无法恢复
				</div>
				<div className="center margin-bottom30">
					是否确认撤销？
				</div>
				<div className="flex">
					<div className="center flex1">
						<p className="border padding-left-right borderRadius4" onClick={()=>this.abolishConfirmEvent()}>确认</p>
					</div>
					<div className="center flex1">
						<p className="border padding-left-right borderRadius4" onClick={()=>this.abolishEvent()}>取消</p>
					</div>
				</div>
			</div>
		)
	}
	//当点击派发，计划人填写之后，按确认之后，模态框是否显示
	confirmTipsShowModel() {
		return(
			<div className="confirmTipsShowModel">
				<div className="center margin-bottom">
					<div className="loadImage">
						<img src={ loadImage } alt="" />
					</div>
				</div>
				<div className="center">
					派发中
				</div>
				<div className="center">
					请耐心等待
				</div>
			</div>
		)
	}
	render(){
		//console.log(this.state.planManList);
		return (
			<div className="distribute">
				<HeaderTitle createMessage="创建信息" typeName={this.state.workOrderStatusString} />
				<ul className="distribute_detail margin-bottom">
					<li className="flex">
						<p>机器码：</p>
						<p className="flex1">{ this.state.machineCode} </p>
					</li>
					<li className="flex">
						<p>点位：</p>
						<p className="flex1">{this.state.location}</p>
					</li>
					<li className="flex">
						<p>地址：</p>
						<p className="flex1">{ this.state.address }</p>
					</li>
					<li className="flex">
						<p>城市：</p>
						<p>{ this.state.city }</p>
					</li>
					<li className="flex">
						<p>类型：</p>
						<p>{ this.state.type }</p>
					</li>
					<li className="flex">
						<p className="demand">需求：</p>
						<p className="flex1">{ this.state.demand }</p>
					</li>
					<li className="flex">
						<p>期望完成时间：</p>
						<p>{ this.state.complete_time }</p>
					</li>
					<li className="flex">
						<p className="teachingVideo">视频：</p>
						<a className="flex1 ellipsis" href={this.state.teachingVideo}>{ this.state.teachingVideo }</a>
					</li>
					<li className="flex">
						<p>创建人：</p>
						<p>{ this.state.createPerson}</p>
					</li>
					<li className="flex">
						<p>创建时间：</p>
						<p>{ this.state.createTime }</p>
					</li>
					<li>
						<p>图片：</p>
					</li>
					<ul className="createImages clearfix">
						{
							this.state.createImages.map((item,index)=>{
								return(
									<li className="img_item float-left" key={index}>
										<img src={item} alt=""/>
									</li>
								)
							})
						}
					</ul>
				</ul>
				<HeaderTitle createMessage="派发信息" />
				<div className="distribute_message">
					<div className="selectPlanMan margin-bottom">
						<div className="flex">
							<p className="center color_red">*</p>
							<p className="center">计划执行人：</p>
							<p className="center downImg flex1" onClick={()=>{this.downMenuEvent()}}>
								{ this.state.planExecuteMan }
							</p>
						</div>
						<div className="menuShow">
							{
								this.state.menu ? 
								<ul className="menu_list">
									{
										this.state.planManList.map((item,index)=>{
											return (
												<li key={index} className="menu_item center"
												onClick={ ()=>this.planManEvent(index)}>
													{item.realname}
												</li>
											)
										})
									}
								</ul>:''
							}
						</div>
					</div>
					<div className="flex margin-bottom">
						<p>备注：</p>
						<textarea className="remark_describe flex1"
						onChange={(e)=>{this.remarkChangeEvent(e)}}
						value={ this.state.remark }>
							
						</textarea>
					</div>
					<div className="margin-bottom">
						<FormImage imgName="图片：" getfiles={ this.getfiles.bind(this) } />
					</div>
					<div className="center border margin-top margin-bottom paddingUpDown borderRadius4"
					onClick={()=>{ this.distributeEvent()}}>
						派发
					</div>
					<div className="center border margin-top margin-bottom paddingUpDown borderRadius4"
					onClick={()=>{ this.cancelEvent()}}>
						撤销
					</div>
				</div>
				{
					this.state.shade ? this.shadeShowModel():null
				}
				{
					this.state.confirmModel? this.confirmShowModel():null
				}
				{
					this.state.cancelModel? this.cancelShowModel():null
				}
				{
					this.state.isPlanExecuteMan ? this.planExecuteManShowModel():null
				}
				{
					this.state.confirmTips ? this.confirmTipsShowModel():null
				}
			</div>
		)
	}
}