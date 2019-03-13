//分页
$(function(){
      
        $('.setPage').change(function(){

            getMsg(parseInt($(this).val()))
        })

        function getMsg(num){
            $.ajax({
                url:'data/JIAOYI.json',
                type:'GET',
                dataType:'json',
                success:function(data){
                		var sun1 = data;
                    //1.计算分页数量
                    var showNum=num;
                    var dataL=data.list.length;
                    var pageNum=Math.ceil(dataL/showNum);
                    //var address = data.list[0].bus.address;
                  // var bus_Id=data.list[0].bus.bus_Id; 
                     //   var money=data.list[0].bus.money;
                    $('.Pagination').pagination(pageNum,{
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 4, //主体页数
                        items_per_page: 1, //每页显示1项
                        prev_text: "上一页",
                        next_text: "下一页",
                        callback:function(index){
                        	var aaaaa = index;
                        	console.log(index);
                            var html='<ul>'

                            console.log(showNum*index+'~'+parseInt(showNum*index)+parseInt(showNum))
                            for(var i = showNum*index; i < showNum*index+showNum;i++){
                            		var qqqq = dataL;
                                console.log(i)
                                if(i<dataL){
                                     var address = data.list[i].bus.address;
                                     var bus_Id=data.list[i].bus.bus_Id; 
                                     var money=data.list[i].bus.money;
                                     
                                     //var status=data.list[i].status;
                                     //var time=data.list[i].time;
                                     var name="网点充值";
                                     var hh = "已完成"
                                      html += "<li >";

                                       
                                        html += "<div class='detail'>";
                                        
                                        html += "<span class='price1'>" + address + "</span>"
                                        html += "<span class='price2'>" + money  + "</span>"
                                        html += "<span class='price3'>" + bus_Id + "</span>"
                                        //html += "<span class='price4'>" + recharge + "</span>"
                                        html += "<span class='price5'>" + hh + "</span>"
                                        html += "<span class='price6'>" + hh + "</span>"
                                        
                                        
                                        html += "</div></li>";
                                }
                            }
                            html+='</ul>';
                            $('.list').html(html)
                        }
                    })
                    
                }
            })
        }
        getMsg(8)
     
})