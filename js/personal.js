 
//// 上传身份证
// function readFile(){
//              var fd = new FormData();   
//              for(var i=0;i<this.files.length;i++){   
//                  var reader = new FileReader();   
//                  reader.readAsDataURL(this.files[i]);   
//                  fd.append(i,this.files[i]);<br>　　　　　　　　　 }   
//                  $.ajax({   
//                      url : '',   
//                      type : 'post',   
//                      data : fd,   
//                      success : function(data){   
//                          console.log(data)   
//                    　}    
//                  })   
//  }      





//编辑页面上传图片
    $('#img1').on('change', function () {
        setImgPreview('img1', 'preview');
    });
    $('#img2').on('change', function () {
        setImgPreview('img2', 'preview2');
    });

//上传图片
function setImgPreview(imgObj, prev) {
    var docObj = $("#" + imgObj);
    var imgObjPreview = $("#" + prev);
    //异步上传图片
    uploadImage(docObj, imgObjPreview)
}


function uploadImage(docObj, imgObjPreview) {
    //判断是否有选择上传文件
    var imgPath = docObj.val();
    if (imgPath == "") {
        //alert("请选择上传图片！");
        hDialog.show({ type: 'toast', toastText: '请选择上传图片！', toastTime: 3000, hasMask: false });
        return;
    }
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (strExtension != 'jpg' && strExtension != 'gif'
    && strExtension != 'png' && strExtension != 'bmp') {
        //alert("请选择图片文件！");
        hDialog.show({ type: 'toast', toastText: '请选择图片文件！', toastTime: 3000, hasMask: false });
        return;
    }

    var ImgObj = new Image();      //建立一个图像对象 
    var AllowImgFileSize = 2100000;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
    ImgObj.src = docObj[0].value;
    //checkSizeofImg();
    //function checkSizeofImg() {
    //    if (ImgObj.readyState != "complete") { //如果图像是未加载完成进行循环检测         
    //        setTimeout("checkSizeofImg()", 500);
    //        //return false;
    //    }
    //}

    //ImgObj.onload = function () {
    //    ImgFileSize = Math.round(ImgObj.fileSize / 1024 * 100) / 100;//取得图片文件的大小 
    //    if (AllowImgFileSize != 0 && AllowImgFileSize < ImgFileSize) {
    //        hDialog.show({ type: 'toast', toastText: '上传失败，请上传不大于2M的图片！', toastTime: 3000, hasMask: false });
    //        return;
    //    }
    //}

    //var file = $("#" + imgObj).files[0];
    var reader = new FileReader();
    var file = docObj[0].files[0];
    var imgUrlBase64;
    if (file) {
        //将文件以Data URL形式读入页面  
        imgUrlBase64 = reader.readAsDataURL(file);
        reader.onload = function (e) {
            //var result = document.getElementById("result");
            var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;
            if (AllowImgFileSize != 0 && AllowImgFileSize < ImgFileSize) {
                hDialog.show({ type: 'toast', toastText: '上传失败，请上传不大于2M的图片！', toastTime: 3000, hasMask: false });
                return;
            }

            //显示文件  
            imgObjPreview.attr("src", reader.result);

            //字符串形式上传  //data:image/png;base64,
            var imgDataBase64 = imgObjPreview.attr("src").substring(imgObjPreview.attr("src").indexOf(",") + 1);
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: { "_Image": imgDataBase64, "_format": "." + strExtension },
                url: ajaxUrl + 'UploadIDCartImageBase64',
                success: function (data) {
                    if (data) {
                        imgObjPreview.attr("src", data);
                        $("." + docObj.attr("name")).val(data);
                        docObj.parent().find('.logo-img2').remove();
                    }
                },
                //此接口返回的图片路径是error的响应文本
                error: function (xhr) {
                    imgObjPreview.attr("src", xhr.responseText);
                    $("." + docObj.attr("name")).val(xhr.responseText);
                    docObj.parent().find('.logo-img2').remove();
                },
                beforeSend: function () {

                    var logoImg = '<img src="../images/loanding.gif" class="logo-img2" style="position: absolute;left: 50%;top: 50%;width: 20px; height: 20px; -webkit-transform: translate(-50%,-50%);">';
                    docObj.parent().append(logoImg);
                }
            });
        }
        reader.onerror = function () {
            alert("error");
        }
    }


}



//充值记录里面的分页
$(function(){
      
        $('.setPage').change(function(){

            getMsg(parseInt($(this).val()))
        })

        function getMsg(num){
            $.ajax({
                url:'data/new_file.json',
                type:'GET',
                dataType:'json',
                success:function(data){
                    //1.计算分页数量
                    var showNum=num;
                    var dataL=data.list.length;
                    var pageNum=Math.ceil(dataL/showNum);
                    $('.Pagination').pagination(pageNum,{
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 4, //主体页数
                        items_per_page: 1, //每页显示1项
                        prev_text: "上一页",
                        next_text: "下一页",
                        callback:function(index){
                        	//console.log(index);
                            var html='<ul>'

                            console.log(showNum*index+'~'+parseInt(showNum*index)+parseInt(showNum))
                            for(var i = showNum*index; i < showNum*index+showNum;i++){
                                //console.log(i)
                                if(i<dataL){
                                     var charge_Id = data.list[i].charge_Id;
                                     var manager=data.list[i].manager; //交易类型
                                     var recharge=data.list[i].recharge;
                                     var status=data.list[i].status;
                                     var time=data.list[i].time;
                                     var name="网点充值";
                                     var hh = "已完成"
                                      html += "<li >";

                                       
                                        html += "<div class='detail'>";
                                        
                                        html += "<span class='price1'>" + time + "</span>"
                                        html += "<span class='price2'>" + name  + "</span>"
                                        html += "<span class='price3'>" + manager + "</span>"
                                        html += "<span class='price4'>" + recharge + "</span>"
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




