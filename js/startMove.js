function move(obj,json,fun,time,step){
		//取消定时器
		if(obj.timer){
			clearInterval(obj.timer);
		}
		//给形参赋默认值
		if(!time){ 
		  time=10
		}
		if(!step){
			step =10;
		}
		//console.log(step);
		obj.timer=setInterval(function(){
			var bStop = true;
			//获取属性当前的值
			//大小，宽高，位移
			for(var attr in json){
				 var target= json[attr];
				 
				 var iCur= getStyle(obj,attr);
				//去掉样式的单位
				iCur = parseInt(getStyle(obj,attr));
				//添加一个变量，用来记录当前值和目标值之间的差
				var speed=  (target-iCur)/step;
				speed= speed>0?Math.ceil(speed):Math.floor(speed);
				//console.log(iCur+ " "+speed);
				//修改当前值
				if(iCur!=target){
					bStop = false;
				}
				if(attr=="opacity"){
					obj.style[attr]= (iCur+ speed)/100;
					obj.style.filter= "alpha(opacity:"+(iCur+ speed)+")";
					//console.log(iCur+ step);
					//console.log(attr+" "+(iCur+ step)+" "+obj.style[attr]);
				}else{
					obj.style[attr]= iCur+ speed +"px";
				}
				
				
				
			}  // end of for in loop
			if(bStop){
				clearInterval(obj.timer);
				if(fun){
					fun();
				}  //end if(fun)
			}//end of else (iCur!=target)
			
		},time);
}		
		
	function getStyle(obj,attr){
	   //获取对象obj的属性attr的值
		 //大小，宽高，位移
		 var val;
		 if(window.getComputedStyle){//>=ie9 && !ie
		    val= window.getComputedStyle(obj,null)[attr];
		 }else{//<ie9  ie
		    val= obj.currentStyle[attr];
		 }
		 //透明度处理，扩大100
		 if(attr=="opacity"){
			 val = val *100;
		 }
		 return val;
	}