//owner_order.js
import './owner_order.css';
import React,{ Component } from 'react';
import queryString from 'query-string';

//这是全局模拟假数据，后面要通过调用接口得到数据
export default class Owner extends Component{
	constructor(props){
		super(props);
		this.state = {
			typeName: '工单类型',
			typeNameList: ['维修','排查'],
			statusNameList: ['待派发','待执行','执行完成','已撤销'],
			statusName: '工单状态',
			city: '城市',
			type_show: false,
			status_show: false,
			city_show: false,
			array: '',
			cityList: [],
			contentList: [],
			keepList: []
			
		}
	}

	//加载页面调用接口，加载数据
	completeListData() {
		let rname = localStorage.getItem("realname");
		//console.log("查看陈永力的工单",rname);
		if(rname === "陈永力") {
			//console.log("查看陈永力的工单",rname);
			//console.log("陈永力：",rname);
	        let url ='/admin/workOrder/pages';
			return fetch(url,{
				method: 'GET',
				headers: {
					'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				mode: 'cors'
			}).then(res=>{
				//console.log('res',res);
				return res.json()
			}).then(data=>{
				console.log('工单列表数据：',data);
				if( data.content.length === 0){
					this.props.history.push(`/noorder`);
				}else {
					let list = data.content;
					//console.log();
					list = list.map((item,index)=>{
						//console.log('item.createDate',item.createDate);
						//console.log(parseInt(item.createDate));
						item.createDate = (parseInt(item.createDate).toString() != "NaN") ?  this.format(item.createDate):"时间未知";
						//item.createDate = this.format(item.createDate);
						return item;
					})
					this.setState({
						contentList: list,
						keepList: list,
					})
				}
				
			}).catch(err=>{
				console.log(err);
			})
		}else {
			console.log('查看我的工单');
			let adminId = localStorage.getItem('id');
	        let param = {
	            filter: JSON.stringify({
	                'adminId': adminId,
	            }),
	        }
	        let url ='/admin/workOrder/pages';
			return fetch(`${url}?${queryString.stringify(param)}`,{
				method: 'GET',
				headers: {
					'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				mode: 'cors'
			}).then(res=>{
				//console.log('res',res);
				return res.json()
			}).then(data=>{
				console.log('工单列表数据：',data);
				if( data.content.length === 0){
					this.props.history.push(`/noorder`);
				}else {
					let list = data.content;
					//console.log();
					list = list.map((item,index)=>{
						//console.log('item.createDate',item.createDate);
						//console.log(parseInt(item.createDate));
						item.createDate = (parseInt(item.createDate).toString() != "NaN") ?  this.format(item.createDate):"时间未知";
						//item.createDate = this.format(item.createDate);
						return item;
					})
					this.setState({
						contentList: list,
						keepList: list,
					})
				}
				
			}).catch(err=>{
				console.log(err);
			})
		}
        
	}
	//城市下拉列表
    cityNameList() {
        let url = '/admin/citycode';
        return fetch(url,{
            method: 'GET',
            headers: {
                'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            mode: 'cors'
        }).then(res=>{
            //console.log('res',res);
            return res.json()
        }).then(data=>{
            //console.log('cityList',data);
            this.setState({
                cityList: data.content,
            })
        }).catch(err=>{
            console.log(err);
        })
    }
    //点击我的工单，列表显示所有内容
	myOrderClickEvent() {
		this.completeListData();
		
		// let adminId = localStorage.getItem('id');
  //       let param = {
  //           filter: JSON.stringify({
  //               'adminId': adminId,
  //           }),
  //       }
  //       //console.log('param',param);
		// //let url = '/admin/workOrder/pages?'+queryString.stringify(filter);
  //       let url ='/admin/workOrder/pages';

		// return fetch(`${url}?${queryString.stringify(param)}`,{
		// 	method: 'GET',
		// 	headers: {
		// 		'Authorization':"Bearer "+localStorage.getItem('jwt_token'),
		// 		'Accept': 'application/json',
		// 		'Content-type': 'application/json'
		// 	},
		// 	mode: 'cors'
		// }).then(res=>{
		// 	//console.log('res',res);
		// 	return res.json()
		// }).then(data=>{
		// 	console.log('我的工单：',data);
		// 	if(data.content.length === 0) {
		// 		this.props.history.push(`/noorder`);
		// 	}else {
		// 		let list = data.content;
		// 		//console.log();
		// 		list = list.map((item,index)=>{
		// 			//console.log('item.createDate',item.createDate);
		// 			//console.log(parseInt(item.createDate));
		// 			item.createDate = (parseInt(item.createDate).toString() != "NaN") ?  this.format(item.createDate):"时间未知";
		// 			//item.createDate = this.format(item.createDate);
		// 			return item;
		// 		})
		// 		this.setState({
		// 			contentList: list,
		// 			keepList: list,
		// 			typeName: '工单类型',
		// 			statusName: '工单状态',
		// 			city: '城市',
		// 		})
		// 	}
		// }).catch(err=>{
		// 	console.log(err);
		// })
	}
	componentDidMount() {
		document.title = '我的工单';
		//加载页面调用接口，加载数据
		this.completeListData();
		//工单类型
		//this.setTypeNameList();
		//工单状态
		//this.setStatusNameList();
        //城市列表
        this.cityNameList();
	}
	/**************公用函数**************/
	//处理时间戳
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
    /*************工单类型****************/
	//点击工单类型
	typeClicEvent() {
		//console.log("工单类型");
		this.setState({
			type_show: !this.state.type_show,
			status_show: false
		})
	}
	//点击工单类型中的每一项时，逻辑判断
	typeShowClickEvent(index){
		let typeName= this.state.typeNameList[index];
		//console.log("typeName",typeName);
		let obj = {};
		if( typeName == "工单类型") {	
		}else {
			obj.workOrderTypeString = typeName;
		}
		if( this.state.statusName == "工单状态" ) {	
		}else {
			obj.workOrderStatusString = this.state.statusName;
		}
		if( this.state.city == "城市" ) {	
		}else {
			obj.city = this.state.city;
		}
		//console.log("obj",obj);
		let list = this.state.keepList;
		//for in 遍历对象 
		for(var x in obj) {
			// x 为对象的键 obj[x] 为键值
			list = list.filter((item,index)=>{
				//console.log("item",item[x]);
				return item[x] == obj[x];
			})
		}
		if( list.length === 0){
			this.props.history.push(`/noorder`);
		}else {
			this.setState({
				type_show: false,
				typeName: typeName,
				contentList: list,
				//statusName: '工单状态',
				//city: '城市',
			})
		}
	}
	/*************工单状态****************/
	//点击工单状态
	statusClickEvent() {
		//console.log("工单状态");
		this.setState({
			type_show: false,
			city_show: false,
			status_show :!this.state.status_show
		})
	}
	//点击工单状态时，逻辑判断
	statusShowClickEvent(index) {
		let statusName = this.state.statusNameList[index];
		let obj = {};
		console.log("statusName",statusName);
		if( statusName == "工单状态" ) {
		}else {
			obj.workOrderStatusString = statusName;
		}
		if( this.state.typeName == "工单类型") {	
		}else {
			obj.workOrderTypeString = this.state.typeName;
		}
		if( this.state.city == "城市") {	
		}else {
			obj.city = this.state.city;
		}
		//console.log("obj",obj);
		var list = this.state.keepList;
		console.log("list start",list);
		for(var x in obj) {
			console.log('doing',x,obj,list);
			//console.log("obj[x]",obj[x]);
			list = list.filter((item,index)=>{
				//console.log("item",item);
				//console.log("item[x]",item[x]);
				return item[x] == obj[x];
			})
		}
		if( list.length === 0) {
			this.props.history.push('/noorder');
		}else {
			this.setState({
				status_show: false,
				statusName: statusName,
				contentList: list,
				//typeName: '工单类型',
				//city: '城市',
			})
		}
	}
	/*************城市****************/
    //点击城市
	cityClickEvent() {
		//console.log("点击城市");
		this.setState({
			type_show: false,
			status_show: false,
			city_show: !this.state.city_show
		})
	}
	//点击城市每一项时，逻辑判断
    cityItemEvent(index) {
    	let cityCode = this.state.cityList[index].cityCode;
        //let adminId = localStorage.getItem('id');
        //console.log('cityList',this.state.cityList);
        let filter_list = this.state.cityList.filter((item,index)=>{
            return item.cityCode === cityCode;
        })
        let find_list = this.state.cityList.find((item,index)=>{
            return item.cityCode === cityCode;
        })
        let cityName = find_list.name;
		let obj = {};
		if( this.state.typeName == "工单类型") {	
		}else {
			obj.workOrderTypeString = this.state.typeName;
		}
		if( this.state.statusName == "工单状态") {	
		}else {
			obj.workOrderStatusString = this.state.statusName;
		}
		if( cityName == "城市") {	
		}else {
			obj.city = cityName;
		}
		//console.log('cityName',cityName);
		let list = this.state.keepList;
		for(var x in obj) {
			//console.log('obj[x]',obj[x]);
			list = list.filter((item,index)=>{
				//console.log('item[x]',item[x]);
				return item[x] == obj[x];
			})
		}
		if( list.length === 0){
			this.props.history.push(`/noorder`);
		}else {
			this.setState({
                contentList: list,
                city_show: false,
                city: cityName,
                //typeName: '工单类型',
				//statusName: '工单状态',
            })
		}
    }
    /*************撤销时****************/
	//撤销时
	cityCancelEvent() {
		this.setState({
			city_show: false
		})
	}
	//点击列表页面的每一项时，跳到对应的详情页面
	//一般我们传的都是id
	itemClicklEvent(index) {
		//console.log('跳转到列表详情页面');
		let id = this.state.contentList[index].id;
        console.log('id1',id);
		let state = this.state.contentList[index].workOrderStatus;
		if(state == "DISTRIBUTE"){
			this.props.history.push(`/distribute/${id}`);
		}else if(state == "EXECUTE"){
			this.props.history.push(`/execute/${id}`);
		}else{
			this.props.history.push(`/complete/${id}`);
		}
	}
	render(){
		//console.log(this.state.contentList);
		return (
			<div className="owner">
				<div className="select">
					<ul className="select_list flex">
						<li className="select_item flex1 center border_right"
						onClick={ this.typeClicEvent.bind(this)}>
							{this.state.typeName}
						</li>
						{
							this.state.type_show ?
							<ul className="type_show">
								{
									this.state.typeNameList.map((item,index)=>{
										return (
											<li onClick={() => this.typeShowClickEvent(index)} 
											key={index}
											className="type_item center">
												{ item }
											</li>
										)
									})
								}			
							</ul> : ''
						}
						<li className="select_item flex1 center border_right"
						onClick={ this.statusClickEvent.bind(this)}>
							{this.state.statusName}
						</li>
						{
							this.state.status_show ? 
							<ul className="status_show">
								{
									this.state.statusNameList.map((item,index)=>{
										return (
											<li onClick={()=>{ this.statusShowClickEvent(index)}}
											key={index}
											className="status_item center">
												{item}
											</li>
										)
									})
								}
							</ul>
							:''
						}
						<li className="select_item flex2 center"
						onClick={ this.cityClickEvent.bind(this)}>
							{ this.state.city }
						</li>
						{
							this.state.city_show ? 
							<ul className="city_show">
								{
									this.state.cityList.map((item,index)=>{
										return(
											<li className="city_item center" key={index}
                                            onClick={()=>this.cityItemEvent(index)}>
												{item.name}
											</li>
										)
									})
								}
							</ul>:''
						}
					</ul>
				</div>
				<div className="content">
					{
						this.state.contentList.map((item,index)=>{
							return (
								<ul className="content_list margin-bottom border-bottom" 
								key={index}
								onClick={()=>{this.itemClicklEvent(index)}} >
									<li className="flex">
										<p>机器码：</p>
										<p className="flex1">{ item.machine.sn } </p>
										<p className="flex-end">{ item.workOrderTypeString }</p>
									</li>
									<li className="flex">
										<p>地址：</p>
										<p className="flex1">{ item.machine.address.address }</p>
									</li>
									<li className="flex">
										<p className="center">级别：</p>
										<p className="center">{ item.workOrderLevelString }</p>
										<p className="gread flex-end flex1">{ item.workOrderStatusString }</p>
									</li>
									<li className="flex">
										<p>创建时间：</p>
										<p>{ item.createDate }</p>
									</li>
									<li className="flex">
										<p className="demand">需求：</p>
										<p className="ellipsis flex1">{ item.demand }</p>
									</li>
								</ul>
							)
						})
					}
				</div>
				<div className="myorder center" onClick={()=>{this.myOrderClickEvent()}}>
					我的工单
				</div>
			</div>
		)
	}
}