
import './complete_order.css';

import React,{ Component } from 'react';
import HeaderTitle from '../../components/header_title/header_title';
import FormImage from '../../components/form_image/form_image';

import common from '../../utils/utils.js';

export default class Complete extends Component{
	constructor(props){
		super(props);
		this.state ={
			/************创建信息***************/
			//工单状态
			workOrderStatusString: '',
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
			//视频
			vedio: '',
			//创建人
			createPerson: '',
			//创建时间
			createTime: '',
			//备注
			remark: '',
			//图片
			createImages:[],
			/************派发信息***************/
            //计划执行人
			planExecutive: '',
			//派发时间
			distributeDate: '',
			//派发人
			distributePerson: '',
			/************执行信息***************/
			//派发信息
			//派发人
			distributePerson: '',
			//计划执行人
			planExecutive: '',
			//派发时间
			distributeDate: '',
			//备注：
			remark:'',
			//图片
			distributeImages: [],

			//执行信息
			//实际执行人
			actualExecutive: '',
			//完成时间
			complete_time: '',
			//执行结果
			workOrderResult: '',
			//执行结果描述：
			resultDescription: '',
			//后续情况
			lastingRemark: '',
			//卫生情况
			healthCondition: '',
			//场地定时打扫
			timingSweep: '',
			//垃圾桶摆放
			trash: '',
			//禁烟贴纸
			smokingBanPaster: '',
			//试唱效果
			auditionEffect: '',
			//耳机话筒线固定
			earAndMicrophoneFixed: '',
			//门和闭门器下沉漏油损坏
			doorAndValuedestory: '',
			//脚杯底座固定调平
			footedGlassLeveling: '',
			//空调工作模式：
			airConditionerPattern: '',
			//玻璃门贴纸
			doorPasterChange: '',
			//定时器
			timeOpenInsatll: '',
			//定时器开关时间
			timerOpenTime: '',
			//摄像头安装
			cameraInstall: '',
			//补光灯是否可用: 
			fillLightCanUse: '',
			//手机充电口是否可用
			phoneChargingPort: '',
			//外接耳机口是否可用
			externalEarphonePort: '',
			//竞品
			award: '',
			//设备图片
			equipmentImages:[],
			//卫生图片
			healthImages:[],
			//竞品价格图片：
			awardPriceImages:[],
			//撤销人
			cancelPerson: '',
			//撤销时间
			cancelDate: '',
			//是否展示创建信息
			isShowCreatedMessage: true,
			//在待派发页面撤销时，只显示创建信息和撤销时间和撤销人，
			//不显示派发信息和执行信息
			//是否展示派发信息
			isShowDistributeMessage: true,
			//在待执行页面撤销时，显示派发信息、执行信息和撤销时间、撤销人
			//是否展示执行信息和撤销信息
			isShowExecuteMessage: true,
			//是否展示撤销信息
			isCancelMessage: false,
		}
	}
	fetchData(){
		//执行完成
		var id = this.props.match.params.id;
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
			//如果无派发人时，只展示创建信息
			if(data.cancelPerson&&(!data.distributePerson)&&(!data.planExecutive)) {
				this.setState({
					isShowCreatedMessage: true,
					isShowDistributeMessage: false,
					isShowExecuteMessage: false,
					isCancelMessage: true,
				})
				//如果有派发人，无执行人信息时，展示派发信息
			}else if(data.cancelPerson && data.distributePerson && data.planExecutive){
				this.setState({
					isShowCreatedMessage: true,
					isShowDistributeMessage: true,
					isShowExecuteMessage: false,
					isCancelMessage: true,
				})
				//派发人和执行人都存在
			}


			console.log('complete_order',data);
			//处理期待完成时间
			let complete_time =  this.format(data.expectedFinishDate);
			//处理派发时间
			let distributeDate = this.format(data.distributeDate);
			//处理创建时间
			let createTime = this.format(data.createDate);
			//撤销时间
			let cancelDate = data.cancelDate ? this.format(data.cancelDate) : "";
			//console.log('cancelDate',cancelDate);
			//处理执行结果
			let workOrderResult = this.dealworkOrderResultString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.workOrderResult:"");
			//工作模式
			let airConditionerPattern = this.dealAirConditionerPatternString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.airConditionerPattern:"");
			//玻璃门贴纸更换
			let doorPasterChange = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.doorPasterChange:"");
			let timingSweep = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.timingSweep:"",);
			//垃圾桶摆放
			let trash = this.dealString(data.workOrderExecuteDTO ? data.workOrderExecuteDTO.trash:"");
			
			//禁烟贴纸
			let smokingBanPaster = this.dealString(data.workOrderExecuteDTO ? data.workOrderExecuteDTO.smokingBanPaster:"");
			//耳机话筒线固定
			let earAndMicrophoneFixed = this.dealString(data.workOrderExecuteDTO ? data.workOrderExecuteDTO.earAndMicrophoneFixed:"");
			//门和闭门器下沉漏油损坏
			let doorAndValuedestory = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.doorAndValuedestory:"");
			//脚杯底座固定调平
			let footedGlassLeveling = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.footedGlassLeveling:"");
			//摄像头是否安装
			let cameraInstall = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.cameraInstall:"");
			//补光灯是否可用: 
			let fillLightCanUse =  this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.fillLightCanUse:"");
			//手机充电口是否可用
			let phoneChargingPort = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.phoneChargingPort:"");
			//外接耳机口是否可用
			let externalEarphonePort = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.externalEarphonePort:"");
			//竞品
			let award = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.award:"");
			
			//定时器
			let timeOpenInsatll = this.dealString(data.workOrderExecuteDTO?data.workOrderExecuteDTO.timeOpenInsatll:"");

			this.setState({
				//创建信息
				//工单状态
				workOrderStatusString: data.workOrderStatusString,
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
				//视频
				vedio: data.teachingVideo,
				//创建人
				createPerson: data.createPerson?data.createPerson.realname:"",
				//创建时间
				createTime: createTime,
				//图片
				createImages: data.createImages,

				//派发信息
				//派发人
				distributePerson: data.distributePerson?data.distributePerson.realname:"",
				//计划执行人
				planExecutive: data.planExecutive?data.planExecutive.realname:"",
				//派发时间
				distributeDate: distributeDate,
				//备注：
				remark: data.remark,
				//图片
				distributeImages: data.distributeImages,

				//执行信息
				//实际执行人
				actualExecutive: data.actualExecutive?data.actualExecutive.realname:"",
				//完成时间
				complete_time: complete_time,
				//执行结果
				workOrderResult: workOrderResult,
				//执行结果描述：
				resultDescription: data.workOrderExecuteDTO?data.workOrderExecuteDTO.resultDescription:"",

				//后续情况
				lastingRemark: data.workOrderExecuteDTO?data.workOrderExecuteDTO.lastingRemark:"",
				//卫生情况
				healthCondition: data.workOrderExecuteDTO?data.workOrderExecuteDTO.healthCondition:"",
				//场地定时打扫
				timingSweep: timingSweep,
				//垃圾桶摆放
				trash: trash,
				//禁烟贴纸
				smokingBanPaster: smokingBanPaster,
				//试唱效果
				auditionEffect: data.workOrderExecuteDTO?data.workOrderExecuteDTO.auditionEffect:"",
				//耳机话筒线固定
				earAndMicrophoneFixed: earAndMicrophoneFixed,
				//门和闭门器下沉漏油损坏
				doorAndValuedestory: doorAndValuedestory,
				//脚杯底座固定调平
				footedGlassLeveling: footedGlassLeveling,
				//空调工作模式：
				airConditionerPattern: airConditionerPattern,
				//玻璃门贴纸
				doorPasterChange: doorPasterChange,
				//定时器
				timeOpenInsatll: timeOpenInsatll,
				//定时器开关时间
				timerOpenTime: data.workOrderExecuteDTO?data.workOrderExecuteDTO.timerOpenTime:"",
				//摄像头安装
				cameraInstall: cameraInstall,
				//补光灯是否可用: 
				fillLightCanUse: fillLightCanUse,
				//手机充电口是否可用
				phoneChargingPort: phoneChargingPort,
				//外接耳机口是否可用
				externalEarphonePort: externalEarphonePort,
				//竞品
				award: award,
				//设备图片
				equipmentImages: data.workOrderExecuteDTO?data.workOrderExecuteDTO.equipmentImages:[],
				//卫生图片
				healthImages: data.workOrderExecuteDTO?data.workOrderExecuteDTO.healthImages:[],
				//竞品价格图片：
				awardPriceImages: data.workOrderExecuteDTO?data.workOrderExecuteDTO.awardPriceImages:[],
				//撤销人 
				cancelPerson: data.cancelPerson ? data.cancelPerson.realname : "",
				//撤销时间
				cancelDate: cancelDate,
			})
		}).catch(err=>{
			console.log(err);
		})
	}
	componentDidMount() {
		document.title = '工单详情';
		this.fetchData();
	}
	/**************公用函数**************/
	adds(m){
		return m < 10 ? '0' + m : m;
	}
	//处理时间戳
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
	//处理执行结果，转化成为对应的中文
	dealworkOrderResultString(value) {
		if(value=="FINISHCKECKANDREPAIR"){
			return '完成排查、维修且故障修复';
		}else if(value=="FINISHCKECKANDUNREPAIR"){
			return '完成排查、维修但故障未修复';
		}else if(value=="UNFINISHCHECKANDUNREPAIR"){
			return '未完成排查、维修';
		}
	}
	//处理空调的工作模式，转化为对应的中文
	dealAirConditionerPatternString(value){
		if(value === "CLOD"){
			return "制冷";
		}else if(value === "WIND"){
			return "排风";
		}else if( value === "CLOSE"){
			return "关闭";
		}
	}
	//处理YES和NO的函数
	dealString(value,isChange=true) {
		if(!isChange){
			return value;
		}
		if( value === "YES"){
			return '是';
		}else if(value === "NO"){
			return '否';
		}
	}
	render(){
		return (
			<div className="complete">
				{
					this.state.isShowCreatedMessage?
					<div className="showCreateMessage">
						<HeaderTitle createMessage="创建信息"  typeName={this.state.workOrderStatusString}/>
						<ul className="complete_detail margin-bottom">
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
								<a className="flex1 ellipsis" href={this.state.vedio}>{ this.state.vedio }</a>
							</li>
							<li className="flex">
								<p>创建人：</p>
								<p>{ this.state.createPerson}</p>
							</li>
							<li className="flex">
								<p>创建时间：</p>
								<p>{ this.state.createTime}</p>
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
					</div>:null
				}
				{
					this.state.isShowDistributeMessage?
					<div className="showDistributeMessage">
						<HeaderTitle createMessage="派发信息" />
						<div className="complete_message margin-bottom">
							<div className="flex margin-bottom">
								<p>派发人：</p>
								<p>{ this.state.distributePerson }</p>
							</div>
							<div className="flex margin-bottom">
								<p>计划执行人：</p>
								<p>{ this.state.planExecutive}</p>
							</div>
							<div className="flex margin-bottom">
								<p>派发时间：</p>
								<p>{ this.state.distributeDate }</p>
							</div>
							<div className="flex margin-bottom">
								<p className="remark_text">备注：</p>
								<p className="flex1">{ this.state.remark }</p>
							</div>
							<li>
								<p>图片：</p>
							</li>
							<ul className="completeImages clearfix">
								{
									this.state.distributeImages.map((item,index)=>{
										return(
											<li className="img_item float-left" key={index}>
												<img src={item} alt=""/>
											</li>
										)
									})
								}
							</ul>
						</div>
					</div>:null
				}
				{
					this.state.isShowExecuteMessage?
					<div className="showExecuteMessage">
						<HeaderTitle createMessage="执行信息" />
						<div className="padding">
							<div className="flex margin-bottom">
								<p>实际执行人：</p>
								<p>{this.state.actualExecutive}</p>
							</div>
							<div className="flex margin-bottom">
								<p>完成时间：</p>
								<p>{ this.state.complete_time}</p>
							</div>
							<div className="flex margin-bottom">
								<p>执行结果：</p>
								<p>{ this.state.workOrderResult }</p>
							</div>
							<div className="flex margin-bottom">
								<p>执行结果描述：</p>
								<p>{ this.state.resultDescription}</p>
							</div>
							<div className="flex margin-bottom">
								<p>后续情况描述：</p>
								<p>{  this.state.lastingRemark}</p>
							</div>

							<div className="flex margin-bottom">
								<p>卫生情况：</p>
								<p>{  this.state.healthCondition}</p>
							</div>
							<div className="flex margin-bottom">
								<p>场地定时打扫：</p>
								<p>{  this.state.timingSweep }</p>
							</div>
							<div className="flex margin-bottom">
								<p>垃圾桶摆放：</p>
								<p>{ this.state.trash }</p>
							</div>
							<div className="flex margin-bottom">
								<p>禁烟贴纸：</p>
								<p>{ this.state.smokingBanPaster }</p>
							</div>

							<div className="flex margin-bottom">
								<p>试唱效果：</p>
								<p>{ this.state.auditionEffect}</p>
							</div>
							<div className="flex margin-bottom">
								<p>耳机话筒线固定：</p>
								<p>{ this.state.earAndMicrophoneFixed }</p>
							</div>
							<div className="flex margin-bottom">
								<p>门和闭门器下沉漏油损坏：</p>
								<p>{ this.state.doorAndValuedestory }</p>
							</div>
							<div className="flex margin-bottom">
								<p>脚杯底座固定调平：</p>
								<p>{ this.state.footedGlassLeveling}</p>
							</div>
							<div className="flex margin-bottom">
								<p>空调工作模式：</p>
								<p>{ this.state.airConditionerPattern }</p>
							</div>
							<div className="flex margin-bottom">
								<p>玻璃门贴纸更换：</p>
								<p>{ this.state.doorPasterChange }</p>
							</div>
							<div className="flex margin-bottom">
								<p>定时器安装：</p>
								<p>{ this.state.timeOpenInsatll }</p>
							</div>
							<div className="flex margin-bottom">
								<p>定时器开关时间：</p>
								<p>{ this.state.timerOpenTime }</p>
							</div>
							<div className="flex margin-bottom">
								<p>摄像头安装：</p>
								<p>{ this.state.cameraInstall }</p>
							</div>
							<div className="flex margin-bottom">
								<p>补光灯是否可用：</p>
								<p>{ this.state.fillLightCanUse }</p>
							</div>
							<div className="flex margin-bottom">
								<p>手机充电口是否可用：</p>
								<p>{ this.state.phoneChargingPort }</p>
							</div>
							<div className="flex margin-bottom">
								<p>外接耳机口是否可用：</p>
								<p>{ this.state.externalEarphonePort }</p>
							</div>
							<div className="flex margin-bottom">
								<p>是否有竞品：</p>
								<p>{ this.state.award}</p>
							</div>
							<div className="equipmentImages_box margin-bottom">
								<div>
									<p>设备图片：</p>
								</div>
								<ul className="equipmentImages clearfix">
									{
										this.state.equipmentImages.map((item,index)=>{
											return(
												<li className="img_item float-left" key={index}>
													<img src={item} alt=""/>
												</li>
											)
										})
									}
								</ul>
							</div>
							<div className="healthImages_box margin-bottom">
								<div>
									<p>卫生图片：</p>
								</div>
								<ul className="healthImages clearfix">
									{
										this.state.healthImages.map((item,index)=>{
											return(
												<li className="img_item float-left" key={index}>
													<img src={item} alt=""/>
												</li>
											)
										})
									}
								</ul>
							</div>
							<div className="awardPriceImages_box margin-bottom">
								<div>
									<p>竞品价格图片：</p>
								</div>
								<ul className="awardPriceImages clearfix">
									{
										this.state.awardPriceImages.map((item,index)=>{
											return(
												<li className="img_item float-left" key={index}>
													<img src={item} alt=""/>
												</li>
											)
										})
									}
								</ul>
							</div>
						</div>
					</div>:null
				}
				{
					this.state.isCancelMessage?
					<div className="create_message">
						<HeaderTitle createMessage="撤销信息" />
						<div className="padding">
							<div className="flex margin-bottom">
								<p>撤销人：</p>
								<p>{ this.state.cancelPerson }</p>
							</div>
							<div className="flex margin-bottom">
								<p>撤销时间：</p>
								<p>{ this.state.cancelDate}</p>
							</div>
						</div>
					</div>:null
				}
			</div>
		)
	}
}