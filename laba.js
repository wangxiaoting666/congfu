window.onload=function(){
function voice(){
	//获取元素
	var info = document.getElementById("information");
	var voiceL = document.getElementById("L");
	var voiceR = document.getElementById("R");
					//创建ajax 
	var ajax = new XMLHttpRequest();
	//open
	ajax.open("GET","dongtai.json?d="+new Date().getTime(),true);
	//send
	ajax.send(null);
	//返回值
	ajax.onreadystatechange = function(){
		if(ajax.readyState ==4 && ajax.status == 200){
			fn_succ(ajax.responseText);//调用函数
		}
	}
	//创建内容
	function fn_succ(res){
		var obj = eval("("+res+")");
		//console.log(obj);
		var html = "";
		for(var i=0;i<obj.length;i++){
			html +='<li><a>'+obj[i].name+'</a>热烈欢迎《<a>'+obj[i].demo+'</a>》入驻本店</li>';
		}
		info.innerHTML = html;//放到ul里面
		
	}
					//控制信息的运动
	//运动
	var ulH = info.children.length*46;
	var lis = info.children;
	//	console.log(lis);
	//	autoplay
	var timer01;
	
	function autoplay01(){
		clearInterval(timer01);
		timer01 = setInterval(voiceMove,5000);
	}
	autoplay01();//让程序自动执行
	function voiceMove(){//手动移动
		
		move(info,{"top":-46},function(){
				info.appendChild(lis[0]);
				info.style.top = 0;
			},60);
	}
	
	//	点击事件,点击向上移动
	voiceL.onclick = function(){
		clearInterval(timer01);
		voiceMove();
		autoplay01();
	}
	//	点击事件,点击向下移动
	voiceR.onclick = function(){
		clearInterval(timer01);
		info.insertBefore(lis[lis.length-1],lis[0]);
		info.style.top = -46+"px";
		move(info,{"top":0},"",60);
		autoplay01();
	}
}
	voice();
}
				//小喇叭消息结束