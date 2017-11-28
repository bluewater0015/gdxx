
import './execute_detail.css';
import React,{ Component } from 'react';
import HeaderTitle from '../../components/header_title/header_title';
import FormImage from '../../components/form_image/form_image';
import loadImage from './images/load.gif';
export default class Execute extends Component{
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
			//创建图片
			createImages: [],
			//派发图片
			distributeImages:[],

			
			/**********派发信息***********/
			//计划执行人是否为空
			isPlanExecuteMan: false,
			//计划执行人
			distributeMan: '',
			//备注
			remark: '',

			//计划执行人id
			planExecutiveId: '',
			//计划执行人
			planExecuteMan: '',
			planManList: [],

			/**********select 框中的value值，默认都为空***********/
			//执行结果描述
			resultDescribe: '',
			//后续情况备注
			situationRemark: '',
			//卫生
			healthSituation: '',
			//试唱效果
			audtionEffect: '',
			//定时器安装：
			timerInstall:'',
			//定时器开关时间
			timerTime: '',
			//执行结果
			executeResult:'',
			//场地定时打扫：
			timerSweep: '',
			//垃圾桶摆放：
			dustbinPut:'',
			//禁烟贴纸：
			forbidPaster:'',
			//耳机话筒线固定：
			earFixed:'',
			//脚杯底座固定调平
			footerFixed:'',
			//门和闭门器下沉漏油损坏：
			doorDamage:'',
			//空调工作模式：
			airConditioner:'',
			//玻璃门贴纸更换：
			doorChange:'',
			//摄像头安装：
			cameraInstall:'',
			//补光灯是否可用(双屏机必填)：
			isMakeUpLamp:'',
			//手机充电口是否可用(双屏机必填)：
			isPhoneCharge:'',
			//外接耳机口是否可用(双屏机必填)：
			isEarphone:'',
			//是否有竞品：
			isCompete:'',
			/**********图片初始化信息***********/
			form: {
				name: '',
				files: [],
			},
			formEquip: {
				files: [],
			},
			formHealth: {
				files: [],
			},
			formAward: {
				files: [],
			},
			/**********校验错误时加的border***********/
			executeResultborder:false,
			resultborder: false,
			situationborder:false,
			healthborder:false,
			timerborder:false,
			dustbinborder:false,

			forbidborder:false,
			audtionborder:false,
			earFixedborder:false,
			doorDamageborder:false,
			footerborder:false,

			airborder:false,
			doorborder:false, 
			timerInstallborder:false, 
			timerTimeborder:false,
			cameraborder:false,

			isMakeborder:false,
			isPhoneChargeborder:false,
			isEarphoneborder:false, 
			isCompeteborder:false,
			/**********各种弹出框***********/
			//确认弹出框
			confirmModel: false,
			//撤销弹出框
			cancelModel: false,
			//遮罩层
			shade: false,
			//计划执行人的下拉菜单
			menu: false,
			//完成工单信息不全的model
			completeOrder: false,
			//设备图片提示
			equipImageTips:'',
			//卫生图片提示
			healthImageTips:'',
			//完成工单的提示的model,
			completeTipModel: false,
			//当点完成工单按钮，数据齐全时，弹出确认
			completeOrderConfirmModel: false,
			//转发工单时，点击确认按钮时，加载模态框
			transmitConfirmModel: false,
		}
	}
	fetchData(){
		let id = this.props.match.params.id;
		//console.log('id',id);
		let url = '/admin/workOrder/page/'+id;
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
			console.log('executeList',data);
			let complete_time =  this.format(data.expectedFinishDate);
			let distributeDate = this.format(data.distributeDate);
			//创建时间
			let createTime = this.format(data.createDate);
			//如果计划执行人不为空的话，渲染数据
			this.setState({
				//派发图片
				distributeImages: data.distributeImages,
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
				createImages: data.createImages,
				/*派发信息*/
				//派发人
				distributePerson: data.distributePerson.realname,
				//派发时间
				distributeDate: distributeDate,
				/*执行信息*/
				//计划执行人
				planExecuteMan: data.planExecutive.realname,
				//备注
				remark: data.remark,
				
			})
			
		}).catch(err=>{
			console.log(err);
		})
	}
	componentDidMount() {
		document.title = '工单详情';
		this.fetchData();
	}
	/*************调用接口函数*************/
	//转发工单确认按钮确认按钮之后，调用转发工单接口
	confirmEvent() {
		this.setState({
			confirmModel: false,
			transmitConfirmModel: true,
		})
		let id = this.props.match.params.id;
		let adminId = localStorage.getItem('id');
		console.log('adminId',adminId);
		let param ={
			id:id,
			distributePersonId: adminId,
			//file:this.state.form.files,
			planExecutiveId: this.state.planExecutiveId,
			remark:  this.state.remark
		}

		let formData = new FormData();
		this.state.form.files.forEach(f =>{
			formData.append("file",f);
		})

		formData.append("workOrder", 
	    	new Blob([JSON.stringify(param)], {type:"application/json"}));

		let url = '/admin/workOrder/page/distribute';
		return fetch(url,{
			method: 'PUT',
			headers: {
				'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
				// 'Accept': 'application/json',
				// 'Content-type': 'multipart/form-data'
			},
			body: formData,
			mode: 'cors'
		}).then(res=>{
			return res.json()
		}).then(data=>{
			console.log('转发工单',data);
			this.setState({
				shade: false,
				confirmModel: false,
				transmitConfirmModel: false
			})
			if(data.createPerson.enabled){
				this.props.history.push('/owner');
			}
		}).catch(err=>{
			console.log(err);
		})
		this.setState({
			shade: false,
			confirmModel: false
		})
	}
	//点击计划执行人，调用接口实现下拉菜单
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
				menu: !this.state.menu
			})
		}).catch(err=>{
			console.log(err);
		})

		// this.setState({
		// 	menu: !this.state.menu
		// })
	}
	//撤销时,确认按钮之后调用接口
	abolishConfirmEvent() {
		//点击确认撤销时，才调用接口
		// console.log('点击撤销');
		let id = this.props.match.params.id;
		let adminId = parseInt(localStorage.getItem('id'));
		let url = '/admin/workOrder/page/cancel/' + id + '?adminId='+adminId;
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
		//
		// this.setState({
		// 	shade: false,
		// 	confirmModel: false,
		// 	cancelModel: false,
		// })
	}
	//点击工单完成时，数据齐全，弹窗提示，如果确认时，就提交
	orderConfirm() {
		this.setState({
			completeOrderConfirmModel: false,
			completeTipModel: true,
		})
		let workOrderResult = this.dealworkOrderResultData(this.state.executeResult);
		let airConditionerPattern = this.dealAirConditionerPatternData(this.state.airConditioner);

		let timingSweep = this.dealData(this.state.timerSweep);
		let trash = this.dealData(this.state.dustbinPut);
		let smokingBanPaster = this.dealData(this.state.forbidPaster);
		let earAndMicrophoneFixed = this.dealData(this.state.earFixed);
		let doorAndValuedestory = this.dealData(this.state.doorDamage);
		let footedGlassLeveling = this.dealData(this.state.footerFixed);
		let doorPasterChange = this.dealData(this.state.doorChange);
		let timeOpenInsatll = this.dealData(this.state.timerInstall);
		let cameraInstall = this.dealData(this.state.cameraInstall);
		let fillLightCanUse = this.dealData(this.state.isMakeUpLamp);
		let phoneChargingPort = this.dealData(this.state.isPhoneCharge);
		let externalEarphonePort = this.dealData(this.state.isEarphone);
		let award = this.dealData(this.state.isCompete);
		let workOrderId = this.props.match.params.id;
		//传基本参数的对象
		let param ={
            "workOrderResult": workOrderResult,//执行结果（FINISHCKECKANDREPAIR：完成排查、维修且故障修复，FINISHCKECKANDUNREPAIR：完成排查、维修但故障未修复，UNFINISHCHECKANDUNREPAIR：未完成排查、维修）
            "lastingRemark": this.state.situationRemark,//后续情况描述
            "healthCondition": this.state.healthSituation,//卫生情况
            "timingSweep": timingSweep,//场地定时打扫
            "trash": trash,//垃圾桶摆放
            "smokingBanPaster": smokingBanPaster,//禁烟贴纸
            "auditionEffect": this.state.audtionEffect,//试唱效果
            "earAndMicrophoneFixed": earAndMicrophoneFixed,//耳机话筒线固定
            "doorAndValuedestory": doorAndValuedestory,//门和阀门器下沉漏油损坏

            "footedGlassLeveling": footedGlassLeveling,//脚杯底座固定调平
            "airConditionerPattern": airConditionerPattern,//空调的工作模式（CLOD：制冷，WIND：排风，CLOSE：关闭）
            "doorPasterChange": doorPasterChange,//玻璃门贴纸更换

    		"timeOpenInsatll":timeOpenInsatll,//定时器安装
            "timerOpenTime": this.state.timerTime,//定时器安装时间，格式为时间

            "cameraInstall": cameraInstall,//摄像头安装
            "fillLightCanUse": fillLightCanUse,//补光灯是否可用
            "phoneChargingPort": phoneChargingPort,//手机充电口可用
            "externalEarphonePort": externalEarphonePort,//外接耳机口可用
            "award": award,//是否有竞品
            "resultDescription": this.state.resultDescribe//执行结果描述
		}
		//new一个formData对象
		let formData = new FormData();
	    this.state.formEquip.files.forEach(f =>{
	      		formData.append("equipmentFile", f)	    
	      	}
	    )
	    this.state.formHealth.files.forEach(f =>{
	      		formData.append("healthFile", f)	    
	      	}
	    )
	    this.state.formAward.files.forEach(f =>{
	      		formData.append("awardPriceFile", f)	    
	      	}
	    )
	    formData.append("workOrderExecute", 
    	new Blob([JSON.stringify(param)], {type:"application/json"}));
	    		    
	    //console.log("formData1",formData);
		let url = '/admin/workOrder/page/execute/'+workOrderId;
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
			console.log('完成工单',data);
			this.setState({
				shade: false,
				confirmModel: false,
				completeTipModel: false,
			})
			if(data.createPerson.enabled){
				this.props.history.push('/owner');
				//this.props.history.push('/complete/${workOrderId}');
			}
		}).catch(err=>{
			console.log(err);
		})
	}
	//点击工单完成时，数据齐全，弹窗提示，如果取消时，就不会提交数据
	orderCancel() {
		console.log('1');
		this.setState({
			completeOrderConfirmModel: false,
			shade: false,
		})
	}
	//点击完成工单，调用接口
	completeEvent() {
		//console.log('完成工单');
		//let id = this.props.match.params.Id;
		
		//console.log('forEquip',this.state.formEquip.files);
		//console.log('formHealth',this.state.formHealth.files);
		let result = (this.state.resultDescribe) &&(this.state.healthSituation)
		&&(this.state.audtionEffect)&& (this.state.executeResult) 
		&&(this.state.timerSweep) && (this.state.dustbinPut)
		&&(this.state.forbidPaster) &&(this.state.earFixed)
		&&(this.state.doorDamage) &&(this.state.airConditioner)
		&&(this.state.doorChange) &&(this.state.timerInstall)
		&&(this.state.cameraInstall)&&(this.state.isCompete)
		&&(this.state.situationRemark)&&(this.state.footerFixed)
		&&(this.state.formEquip.files.length > 0) &&(this.state.formHealth.files.length >0);

		let  borders = (!this.state.executeResultborder)&&(!this.state.resultborder)
		&&(!this.state.situationborder)&&(!this.state.healthborder)
		&&(!this.state.timerborder) && (!this.state.dustbinborder)
		&&(!this.state.forbidborder) &&(!this.state.audtionborder)
		&&(!this.state.earFixedborder) && (!this.state.doorDamageborder)
		&&(!this.state.footerborder) && (!this.state.airborder)
		&&(!this.state.doorborder) &&(!this.state.timerInstallborder)
		&&(!this.state.timerTimeborder)&&(!this.state.cameraborder)
		&&(!this.state.isMakeborder) && (!this.state.isPhoneChargeborder)
		&&(!this.state.isEarphoneborder)&& (!this.state.isCompeteborder)
		&&(!this.state.equipImageTips)&&(!this.state.healthImageTips);

		
		
		//如果数据齐全就弹框确认，否则弹窗提示
		if(result && borders){
			this.setState({
				//completeTipModel: true,
				shade: true,
				completeOrderConfirmModel: true,
			})	
		}else{
			this.setState({
				shade: true,
				completeOrder: true,
			})
		}
	}
	//点击完成工单弹出框的确认按钮时，校验每一项
	completeOrderConfirmEvent() {
		this.setState({
			shade: false,
			completeOrder: false,
		})
		//判断执行结果
		if( this.state.executeResult === "请选择" || !this.state.executeResult){
			this.setState({
				executeResultborder: true,
			})
		}else {
			this.setState({
				executeResultborder: false
			})
		}

		//判断执行结果描述是否存在
		if(!this.state.resultDescribe){
			this.setState({
				resultborder: true,
			})
		}else{
			this.setState({
				resultborder: false,
			})
		}
		//后续情况备注
		if(!this.state.situationRemark){
			this.setState({
				situationborder: true,
			})
		}else{
			this.setState({
				situationborder: false,
			})
		}
		//卫生
		if(!this.state.healthSituation){
			this.setState({
				healthborder: true,
			})
		}else{
			this.setState({
				healthborder: false,
			})
		}
		//试唱效果
		if( this.state.audtionEffect === "请选择" || !this.state.audtionEffect){
			this.setState({
				audtionborder: true,
			})
		}else {
			this.setState({
				audtionborder: false
			})
		}
		//定时器安装：
		if( this.state.timerInstall === "请选择" || !this.state.timerInstall){
			this.setState({
				timerInstallborder: true,
			})
		}else {
			this.setState({
				timerInstallborder: false
			})
		}
		//定时器开关时间
		// if(!this.state.timerTime){
		// 	this.setState({
		// 		timerTimeborder: true,
		// 	})
		// }else{
		// 	this.setState({
		// 		timerTimeborder: false,
		// 	})
		// }
		//场地定时打扫：
		if( this.state.timerSweep === "请选择" || !this.state.timerSweep){
			this.setState({
				timerborder: true,
			})
		}else {
			this.setState({
				timerborder: false
			})
		}
		//垃圾桶摆放：
		if( this.state.dustbinPut === "请选择" || !this.state.dustbinPut){
			this.setState({
				dustbinborder: true,
			})
		}else {
			this.setState({
				dustbinborder: false
			})
		}
		//禁烟贴纸：
		if( this.state.forbidPaster === "请选择" || !this.state.forbidPaster){
			this.setState({
				forbidborder: true,
			})
		}else {
			this.setState({
				forbidborder: false
			})
		}
		//耳机话筒线固定：
		if( this.state.earFixed === "请选择" || !this.state.earFixed){
			this.setState({
				earFixedborder: true,
			})
		}else {
			this.setState({
				earFixedborder: false
			})
		}
		// //脚杯底座固定调平
		// footerFixed:'',
		if( this.state.footerFixed === "请选择" || !this.state.footerFixed){
			this.setState({
				footerborder: true,
			})
		}else {
			this.setState({
				footerborder: false
			})
		}
		//门和闭门器下沉漏油损坏：
		if( this.state.doorDamage === "请选择" || !this.state.doorDamage){
			this.setState({
				doorDamageborder: true,
			})
		}else {
			this.setState({
				doorDamageborder: false
			})
		}
		//空调工作模式：
		// airConditioner:'',
		if( this.state.airConditioner === "请选择" || !this.state.airConditioner){
			this.setState({
				airborder: true,
			})
		}else {
			this.setState({
				airborder: false
			})
		}
		// //玻璃门贴纸更换：
		if( this.state.doorChange === "请选择" || !this.state.doorChange){
			this.setState({
				doorborder: true,
			})
		}else {
			this.setState({
				doorborder: false
			})
		}
		// //摄像头安装：
		// cameraInstall:'',
		if( this.state.cameraInstall === "请选择" || !this.state.cameraInstall){
			this.setState({
				cameraborder: true,
			})
		}else {
			this.setState({
				cameraborder: false
			})
		}
		//补光灯是否可用(双屏机必填)：
		// if( this.state.isMakeUpLamp === "请选择" || !this.state.isMakeUpLamp){
		// 	this.setState({
		// 		isMakeborder: true,
		// 	})
		// }else {
		// 	this.setState({
		// 		isMakeborder: false
		// 	})
		// }
		// //手机充电口是否可用(双屏机必填)：
		// isPhoneCharge:'',
		// if( this.state.isPhoneCharge === "请选择" || !this.state.isPhoneCharge){
		// 	this.setState({
		// 		isPhoneChargeborder: true,
		// 	})
		// }else {
		// 	this.setState({
		// 		isPhoneChargeborder: false
		// 	})
		// }
		// //外接耳机口是否可用(双屏机必填)：
		// isEarphone:'',
		// if( this.state.isEarphone === "请选择" || !this.state.isEarphone){
		// 	this.setState({
		// 		isEarphoneborder: true,
		// 	})
		// }else {
		// 	this.setState({
		// 		isEarphoneborder: false
		// 	})
		// }
		// //是否有竞品：
		// isCompete:'',
		if( this.state.isCompete === "请选择" || !this.state.isCompete){
			this.setState({
				isCompeteborder: true,
			})
		}else {
			this.setState({
				isCompeteborder: false
			})
		}
		//formEquip
		console.log('formEquip.length',this.state.formEquip.files.length);
		if(this.state.formEquip.files.length > 0){
	    	this.setState({
	    		equipImageTips: false
	    	})
	    }else {
	    	this.setState({
	    		equipImageTips: true
	    	})
	    }
	    //formHealth
	    console.log('formHealth.length',this.state.formHealth.files.length);
	    if(this.state.formHealth.files.length > 0){
	    	this.setState({
	    		healthImageTips: false
	    	})
	    }else {
	    	this.setState({
	    		healthImageTips: true
	    	})
	    }

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
	//处理执行结果，转化成为对应的英文
	dealworkOrderResultData(value) {
		if(value=="完成排查、维修且故障修复"){
			return 'FINISHCKECKANDREPAIR';
		}else if(value=="完成排查、维修但故障未修复"){
			return 'FINISHCKECKANDUNREPAIR';
		}else if(value=="未完成排查、维修"){
			return 'UNFINISHCHECKANDUNREPAIR';
		}
	}
	//处理空调的工作模式，转化为对应的英文
	dealAirConditionerPatternData(value){
		if(value == "制冷"){
			return "CLOD";
		}else if(value == "排风"){
			return "WIND";
		}else if( value =="关闭"){
			return "CLOSE";
		}
	}
	//处理是和否的函数
	dealData(value,isChange=true) {
		if(!isChange){
			return value;
		}
		if( value == "是"){
			return 'YES';
		}else if(value == "否"){
			return 'NO';
		}
	}
	//点击计划执行人的每项
	planManEvent(index){
		let planExecuteMan = this.state.planManList[index].realname;
		let  planExecutiveId = this.state.planManList[index].id;
		this.setState({
			planExecuteMan: planExecuteMan,
			menu: false,
			planExecutiveId: planExecutiveId
		})
	}
	//处理备注框中多余的文字,超过500字之后截取
	dealtextareaData(value) {
		if(value.length > 500){
			return value.substring(0,500);
		}
		return value;
	}
	//处理input框中多余的文字，超过100字之后截取
	dealtextareaData1(value) {
		if(value.length > 100){
			return value.substring(0,100);
		}
		return value;
	}
	//备注框输入文字时，获取值
	remarkChangeEvent(e) {
		console.log("备注",this.state.remark);
		let value = e.target.value;
		this.setState({
			remark: this.dealtextareaData(value)
		})
	}
	
	//点击转发工单按钮
	transmitEvent() {
		console.log('转发工单');
		//判断计划执行人是否为空
		if(this.state.planExecuteMan){
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
		console.log('点击撤销');
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
	//得到图片
	getfiles(acceptedFiles, rejectedFiles) {
		//console.log('distributeImages',this.state.distributeImages);
		//console.log('acceptedFiles',acceptedFiles);
		(acceptedFiles.length <= 8) && this.setState({
	      ...this.state, form: {
	        ...this.state.form,
	        files: this.state.form.files.concat(acceptedFiles)
	      }
	    });
	}
	//得到设备的图片
	getEquipmentFiles(acceptedFiles,rejectedFiles) {
		//console.log('getEquipmentFiles',acceptedFiles);
		(acceptedFiles.length <= 8) && this.setState({
	      ...this.state, formEquip: {
	        ...this.state.formEquip,
	        files: this.state.formEquip.files.concat(acceptedFiles)
	      }
	    });
	    if(acceptedFiles.length){
	    	this.setState({
	    		equipImageTips: false
	    	})
	    }else {
	    	this.setState({
	    		equipImageTips: true
	    	})
	    }
	}

	deleteEquipmentImages(acceptedFiles){
		(acceptedFiles.length <= 8) && this.setState({
	      ...this.state, formEquip: {
	        ...this.state.formEquip,
	        files: acceptedFiles
	      }
	    });
	    if(acceptedFiles.length){
	    	this.setState({
	    		equipImageTips: false
	    	})
	    }else {
	    	this.setState({
	    		equipImageTips: true
	    	})
	    }
	}
	//得到卫生图片，上传图片
	getHealthFiles(acceptedFiles,rejectedFiles) {
		console.log('getHealthFiles',acceptedFiles);
		(acceptedFiles.length <= 8) && this.setState({
	      ...this.state, formHealth: {
	        ...this.state.formHealth,
	        files: this.state.formHealth.files.concat(acceptedFiles)
	      }
	    });
	    if(acceptedFiles.length) {
	    	this.setState({
	    		healthImageTips: false
	    	})
	    }else {
	    	this.setState({
	    		healthImageTips: true
	    	})
	    }
	}
	//删除图片的逻辑（原本图片删除）
	deleteHealthImages(acceptedFiles){
		(acceptedFiles.length <= 8) && this.setState({
	      ...this.state, formHealth: {
	        ...this.state.formHealth,
	        files: acceptedFiles
	      }
	    });
	    if(acceptedFiles.length){
	    	this.setState({
	    		healthImageTips: false
	    	})
	    }else {
	    	this.setState({
	    		healthImageTips: true
	    	})
	    }
	}
	//得到竞品图片
	getCompeteFiles(acceptedFiles,rejectedFiles) {
		//console.log('getCompeteFiles',acceptedFiles);
		(acceptedFiles.length <= 8) && this.setState({
	      ...this.state, formAward: {
	        ...this.state.formAward,
	        files: this.state.formAward.files.concat(acceptedFiles)
	      }
	    });
	}
	/******************获取select框中的值****************/
	//执行结果
	executeResultEvent(e) {
		var value = e.target.value;
		//console.log("value",value);
		if(value != "请选择"){
			this.setState({
				executeResultborder: false,
				executeResult: value
			})
		}else {
			this.setState({
				executeResultborder: true,
				executeResult: value
			})
		}
		//console.log("value1",value);
	}
	//执行结果描述
	resultDescribeEvent(e) {
		let value = e.target.value;
		console.log('resultDescribe',this.state.resultDescribe);
		if(value != ''){
			this.setState({
				resultDescribe: this.dealtextareaData(value),
				resultborder: false,
			})
		}else {
			this.setState({
				resultDescribe: this.dealtextareaData(value),
				resultborder: true,
			})
		}
	}
	//后续情况备注
	situationRemarkEvent(e) {
		console.log('situationRemark',this.state.situationRemark);
		let value = e.target.value;
		if(value != ''){
			this.setState({
				situationRemark: this.dealtextareaData(value),
				situationborder: false
			})
		}else{
			this.setState({
				situationRemark: this.dealtextareaData(value),
				situationborder: true
			})
		}
	}
	//卫生情况
	healthSituationEvent(e) {
		console.log('卫生情况',this.state.healthSituation);
		let value = e.target.value;
		if(value != ''){
			this.setState({
				healthSituation: this.dealtextareaData1(value),
				healthborder: false,
			})
		}else{
			this.setState({
				healthSituation: this.dealtextareaData1(value),
				healthborder: true
			})
		}
		
	}
	
	//场地定时打扫：
	timerSweepEvent(e) {
		let value = e.target.value;
		if(value != "请选择") {
			this.setState({
				timerSweep: value,
				timerborder: false,
			})
		}else {
			this.setState({
				timerSweep: value,
				timerborder: true,
			})
		}
	}
	//垃圾桶摆放：
	dustbinPutEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		if(value != "请选择") {
			this.setState({
				dustbinPut: value,
				dustbinborder: false
			})	
		}else {
			this.setState({
				dustbinPut: value,
				dustbinborder: true
			})
		}
	}
	//禁烟贴纸：
	forbidPasterEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				forbidPaster: value,
				forbidborder: false
			})
		}else {
			this.setState({
				forbidPaster: value,
				forbidborder: true
			})
		}
	}
	//试唱效果
	audtionEffectEvent(e) {

		console.log('audtionEffect',this.state.audtionEffect);
		let value = e.target.value;
		if(value != ''){
			this.setState({
				audtionEffect: this.dealtextareaData1(value),
				audtionborder: false
			})
		}else{
			this.setState({
				audtionEffect: this.dealtextareaData1(value),
				audtionborder: true
			})
		}
	}
	//耳机话筒线固定：
	earFixedEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		if( value != "请选择") {
			this.setState({
				earFixed: value,
				earFixedborder: false
			})
		}else {
			this.setState({
				earFixed: value,
				earFixedborder: true
			})
		}
	}
	//门和闭门器下沉漏油损坏：
	doorDamageEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);

		if(value != "请选择") {
			this.setState({
				doorDamage: value,
				doorDamageborder: false
			})
		}else {
			this.setState({
				doorDamage: value,
				doorDamageborder: true
			})
		}
	}
	//脚杯底座固定调平：
	footerFixedEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				footerFixed: value,
				footerborder: false,
			})
		}else {
			this.setState({
				footerFixed: value,
				footerborder: true,
			})
		}
	}
	//空调工作模式：
	airConditionerEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if( value != "请选择") {
			this.setState({
				airConditioner: value,
				airborder: false,
			})
		}else {
			this.setState({
				airConditioner: value,
				airborder: true,
			})
		}
	}
	//玻璃门贴纸更换：
	doorChangeEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if( value != "请选择") {
			this.setState({
				doorChange: value,
				doorborder: false
			})
		}else {
			this.setState({
				doorChange: value,
				doorborder: true
			})
		}
	}
	//定时器安装：
	timerInstallEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				timerInstall: value,
				timerInstallborder: false
			})
		}else {
			this.setState({
				timerInstall: value,
				timerInstallborder: true
			})
		}
	}
	//定时器时间
	timerTimeEvent(e) {
		console.log('timerTime',this.state.timerTime);
		let value = e.target.value;
		if(value != '') {
			this.setState({
				timerTime: this.dealtextareaData1(value),
				timerTimeborder: false
			})
		}else {
			this.setState({
				timerTime: this.dealtextareaData1(value),
				timerTimeborder: false
			})
		}
	}
	//摄像头安装：
	cameraInstallEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		if(value != "请选择") {
			this.setState({
				cameraInstall: value,
				cameraborder: false
			})
		}else {
			this.setState({
				cameraInstall: value,
				cameraborder: true
			})
		}
	}
	//补光灯是否可用(双屏机必填)：
	isMakeUpLampEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				isMakeUpLamp: value,
				isMakeborder: false,
			})
		}else {
			this.setState({
				isMakeUpLamp: value,
				isMakeborder: false,
			})
		}
	}
	//手机充电口是否可用(双屏机必填)：
	isPhoneChargeEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				isPhoneCharge: value,
				isPhoneChargeborder: false
			})
		}else {
			this.setState({
				isPhoneCharge: value,
				isPhoneChargeborder: false
			})
		}
	}
	//外接耳机口是否可用(双屏机必填)：
	isEarphoneEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				isEarphone: value,
				isEarphoneborder: false
			})
		}else {
			this.setState({
				isEarphone: value,
				isEarphoneborder: false
			})
		}
	}
	//是否有竞品：
	isCompeteEvent(e) {
		let value = e.target.value;
		console.log('e',e.target.value);
		
		if(value != "请选择") {
			this.setState({
				isCompete: value,
				isCompeteborder: false
			})
		}else {
			this.setState({
				isCompete: value,
				isCompeteborder: true
			})
		}
	}
	/********************弹出框***************/
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
				<div className="center margin-bottom30">
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
						<p className="border padding-left-right borderRadius4"
						onClick={()=>this.abolishConfirmEvent()}>
							确认
						</p>
					</div>
					<div className="center flex1">
						<p className="border padding-left-right borderRadius4"
						onClick={()=>this.abolishEvent()}>
							取消
						</p>
					</div>
				</div>
			</div>
		)
	}
	//完成工单信息不全，提示弹出框
	completeOrderShowModel() {
		return(
			<div className="completeOrderModel">
				<div className="center">提交失败</div>
				<div className="center margin-bottom30">
					请检查执行信息是否填写正确
				</div>
				<div className="flex">
					<div className="center flex1" onClick={()=>this.completeOrderConfirmEvent()}>
						<p className="border padding-left-right borderRadius4">确认</p>
					</div>
				</div>
			</div>
		)
	}
	//加载中的模态框
	completeTipShowModel() {
		return(
			<div className="completeTipShowModel">
				<div className="center margin-bottom">
					<div className="loadImage">
						<img src={ loadImage } alt="" />
					</div>
				</div>
				<div className="center">
					图片上传中
				</div>
				<div className="center">
					请耐心等待
				</div>
			</div>
		)
	}
	//完成工单数据齐全时，就弹出确认弹框
	completeOrderConfirmShowModel() {
		return(
			<div className="completeOrderConfirmShowModel">
				<div className="center margin-bottom30">
					工单将要提交，是否确认？
				</div>
				<div className="flex">
					<div className="center flex1">
						<p className="border padding-left-right borderRadius4"
						onClick={ ()=>this.orderConfirm()}>
							确认
						</p>
					</div>
					<div className="center flex1">
						<p className="border padding-left-right borderRadius4"
						onClick={()=>this.orderCancel()}>
							取消
						</p>
					</div>
				</div>
			</div>
		)
	}
	//transmitConfirmShowModel
	transmitConfirmShowModel() {
		return(
			<div className="completeTipShowModel">
				<div className="center margin-bottom">
					<div className="loadImage">
						<img src={ loadImage } alt="" />
					</div>
				</div>
				<div className="center">
					转发中
				</div>
				<div className="center">
					请耐心等待
				</div>
			</div>
		)
	}
	render(){
		return (
			<div className="execute">
				<HeaderTitle createMessage="创建信息" typeName="待执行" />
				<ul className="execute_detail margin-bottom">
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
				<HeaderTitle createMessage="派发信息" />
				<div className="execute_message">
					<div className="selectPlanMan margin-bottom">
						<div className="flex margin-bottom">
							<p>派发人：</p>
							<p>{ this.state.distributePerson }</p>
						</div>
						<div className="flex margin-bottom">
							<p>派发时间：</p>
							<p>{ this.state.distributeDate }</p>
						</div>
						<div className="flex margin-bottom menuShow_box">
							<p className="color_red">*</p>
							<p>计划执行人：</p>
							<p className="center flex1 downImg" onClick={()=>{this.downMenuEvent()}}>
								{ this.state.planExecuteMan }
							</p>
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
					</div>
					<div className="flex margin-bottom">
						<p>备注：</p>
						<textarea className="remark_describe flex1"
						onChange={(e)=>{this.remarkChangeEvent(e)}}
						value={ this.state.remark }>	
						</textarea>
					</div>
					<div className="margin-bottom">
						<FormImage getfiles={ this.getfiles.bind(this)} distributeImages={this.state.distributeImages} />
					</div>
				</div>
				<div className="margin-bottom padding border-bottom">
					<p className="padding-bottom"> 执行信息（若要转发工单，请勿填写执行信息）</p>
				</div>
				<div className="padding">
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">执行结果:</p>
						<div className="flex1 center">
							<select className="selectActive"
							onChange={(e)=>{ this.executeResultEvent(e) }}
							style={{ border: this.state.executeResultborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>完成排查、维修且故障修复</option>
								<option>完成排查、维修但故障未修复</option>
								<option>未完成排查、维修</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">执行结果描述：</p>
						<textarea className="flex1 border textareaHeight"
						value={this.state.resultDescribe}
						onChange={(e)=>{this.resultDescribeEvent(e)}}
						style={{ border: this.state.resultborder? "1px solid red": "1px solid #ccc"}}>
						</textarea>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">后续情况备注：</p>
						<textarea className="flex1 border textareaHeight"
						value={this.state.situationRemark}
						onChange={(e)=>this.situationRemarkEvent(e)}
						style={{ border: this.state.situationborder? "1px solid red": "1px solid #ccc"}}>
						</textarea>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">卫生情况：</p>
						<div className="flex1 center">
							<input className="inputHeight" type="text" placeholder="请输入卫生情况"
							value={ this.state.healthSituation}
							onChange={(e)=>this.healthSituationEvent(e)} 
							style={{ border: this.state.healthborder? "1px solid red": "1px solid #ccc"}}/>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">场地定时打扫：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=>this.timerSweepEvent(e)}
							style={{ border: this.state.timerborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">垃圾桶摆放：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.dustbinPutEvent(e)}
							style={{ border: this.state.dustbinborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">禁烟贴纸：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.forbidPasterEvent(e)}
							style={{ border: this.state.forbidborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">试唱效果：</p>
						<div className="flex1 center">
							<input className="inputHeight" type="text"
							value={this.state.audtionEffect}
							placeholder="耳机、话筒、音箱、灯光是否正常"
							onChange={(e)=>this.audtionEffectEvent(e)}
							style={{ border: this.state.audtionborder? "1px solid red": "1px solid #ccc"}}/>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">耳机话筒线固定：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.earFixedEvent(e)}
							style={{ border: this.state.earFixedborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">门和闭门器下沉漏油损坏：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.doorDamageEvent(e)}
							style={{ border: this.state.doorDamageborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">脚杯底座固定调平：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.footerFixedEvent(e)}
							style={{ border: this.state.footerborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">空调工作模式：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.airConditionerEvent(e)}
							style={{ border: this.state.airborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>制冷</option>
								<option>排风</option>
								<option>关闭</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">玻璃门贴纸更换：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.doorChangeEvent(e)}
							style={{ border: this.state.doorborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">定时器安装：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.timerInstallEvent(e)}
							style={{ border: this.state.timerInstallborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_white">*</p>
						<p className="pWidth">定时器开关时间：</p>
						<div className="flex1 center">
							<input className="inputHeight" type="text"
							value={this.state.timerTime}
							placeholder="若安装定时器，请填写开关机时间"
							onChange={(e)=>this.timerTimeEvent(e)}
							style={{ border: this.state.timerTimeborder? "1px solid red": "1px solid #ccc"}}/>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">摄像头安装：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.cameraInstallEvent(e)}
							style={{ border: this.state.cameraborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_white">*</p>
						<p className="pWidth">补光灯是否可用(双屏机必填)：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.isMakeUpLampEvent(e)}
							style={{ border: this.state.isMakeborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_white">*</p>
						<p className="pWidth">手机充电口是否可用(双屏机必填)：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.isPhoneChargeEvent(e)}
							style={{ border: this.state.isPhoneChargeborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_white">*</p>
						<p className="pWidth">外接耳机口是否可用(双屏机必填)：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.isEarphoneEvent(e)}
							style={{ border: this.state.isEarphoneborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex margin-bottom">
						<p className="color_red">*</p>
						<p className="pWidth">是否有竞品：</p>
						<div className="flex1 center">
							<select className="selectActive" onChange={(e)=> this.isCompeteEvent(e)}
							style={{ border: this.state.isCompeteborder? "1px solid red": "1px solid #ccc"}}>
								<option>请选择</option>
								<option>是</option>
								<option>否</option>
							</select>
						</div>
					</div>
					<div className="flex">
						<p className="center color_red star_width">*</p>
						<FormImage 
						imgName="设备图片：" 
						getfiles={ this.getEquipmentFiles.bind(this)} 
						getDelete={this.deleteEquipmentImages.bind(this)}/>
					</div>
					<div className="center color_red">{ this.state.equipImageTips ? '设备图片不能为空':''}</div>
					<div className="flex">
						<p className="center color_red star_width">*</p>
						<FormImage imgName="卫生图片：" 
						getfiles={ this.getHealthFiles.bind(this) }
						getDelete={this.deleteHealthImages.bind(this)}
						/>
					</div>
					<div className="center color_red">{ this.state.healthImageTips ? '卫生图片不能为空':''}</div>
					<div className="flex">
						<p className="center color_white star_width">*</p>
						<FormImage imgName="竞品价格图片(有竞品则必须上传)：" getfiles={ this.getCompeteFiles.bind(this)}/>
					</div>
				</div>

				<div className="padding">
					<div className="center border margin-top margin-bottom paddingUpDown borderRadius4"
					onClick={()=>{ this.transmitEvent()}}>
						转发工单
					</div>
					<div className="center border margin-top margin-bottom paddingUpDown borderRadius4"
					onClick={()=>{ this.completeEvent() }}>
						完成工单
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
					this.state.completeOrder ? this.completeOrderShowModel():null
				}
				{
					this.state.completeTipModel ? this.completeTipShowModel():null
				}
				{
					this.state.completeOrderConfirmModel ? this.completeOrderConfirmShowModel():null
				}
				{
					this.state.transmitConfirmModel ? this.transmitConfirmShowModel():null
				}
			</div>
		)
	}
}