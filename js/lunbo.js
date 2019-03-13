window.onload=function(){
function banner(){
	//获取元素
	var btnL = document.getElementById("btnLeft");	
	var btnR = document.getElementById("btnRight");
	var pic  = document.getElementById("pic");
	var picImg  = document.getElementById("pic").getElementsByTagName("img");
	
	//透明轮播图
	var count=0;
	var timer;
	function autoplay(){
		clearInterval(timer);
		timer = setInterval(function(){
			count++;
			move(picImg[count-1],{"opacity":0},"",60);
			if(count == picImg.length){
				count=0;
				move(picImg[0],{"opacity":100},"",60);
			}else{
				move(picImg[count],{"opacity":100},"",60);
			}
		},3000);
		
	}
	autoplay();
	//点击按钮btnL移动
	btnL.onclick = function (){
		clearInterval(timer);
		//console.log(count);
		count--;
		move(picImg[count+1],{"opacity":0},"",60);
		if(count == -1){
			count = picImg.length-1;
			move(picImg[count],{"opacity":100},"",60);
		}else{
			move(picImg[count],{"opacity":100},"",60);
		}
		autoplay();
	
	}
	//点击按钮btnR移动
	btnR.onclick = function (){
		clearInterval(timer);
		//console.log(count);
		count++;
		move(picImg[count-1],{"opacity":0},"",60);
		if(count == picImg.length){
			count=0;
			move(picImg[0],{"opacity":100},"",60);
		}else{
			move(picImg[count],{"opacity":100},"",60);
		}
		autoplay();

	}
}
banner();
}
				//banner结束