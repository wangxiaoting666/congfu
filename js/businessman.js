//分页
$(function(){
      
        $('.setPage').change(function(){

            getMsg(parseInt($(this).val()))
        })

        function getMsg(num){
            $.ajax({
                url:'data/list.json',
                type:'GET',
                dataType:'json',
                success:function(data){
                    //1.计算分页数量
                    var showNum=num;
                    var dataL=data.length;
                    var pageNum=Math.ceil(dataL/showNum);
                    $('.Pagination').pagination(pageNum,{
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 4, //主体页数
                        items_per_page: 1, //每页显示1项
                        prev_text: "上一页",
                        next_text: "下一页",
                        callback:function(index){
                        	console.log(index);
                            var html='<ul>'

                            console.log(showNum*index+'~'+parseInt(showNum*index)+parseInt(showNum))
                            for(var i = showNum*index; i < showNum*index+showNum;i++){
                                console.log(i)
                                if(i<dataL){
                                        var $id = data[i].id;
                                         
                                        
                                        var info = data[i].info;
                                        var jiaoyi=data[i].jiaoyi;//交易类型
                                        var jiaoyif=data[i].jiaoyif;
                                        var jine=data[i].jine;
                                        var zt=data[i].zt;
                                        var caoz=data[i].caoz;

                                        
                                        html += "<li >";
                                   
                                        
                                        html += "<div class='detail'>";
                                        
                                        html += "<span class='price1'>" + info  + "</span>"
                                        html += "<span class='price2'>" + jiaoyi + "</span>"
                                        html += "<span class='price3'>" + jiaoyif + "</span>"
                                        html += "<span class='price4'>" + jine + "</span>"
                                        html += "<span class='price5'>" + zt + "</span>"
                                        html += "<span class='price6'>" + caoz + "</span>"
                                        
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