// 初始化
$(function(){
    banner();
    $('[data-toggle="tooltip"]').tooltip();//需要自己去初始化工具提示
})
// 动态轮播图
function banner(){
    var myData;
    // 获取数据
    var getData=function(callback){
        if(myData){
            callback&&callback(myData);
            return false;
        }
        // 获取数据
        $.ajax({
            url:'js/index.json',//相对页面请求路径
            type:'get',
            data:{},
            dataType:'json',
            success:function(data){
                //当我们做一次时需要记录
                myData=data;
                callback&&callback(myData);
            }
        });
    };
    //渲染
    var render=function(){
        // 半段当前是什么设备，768px以下都是移动设备
        // 根据设备来解析数据（json转化HTML，字符串拼接，模板引擎）
        // 渲染在HTML中，HTML（解析的字符串）
        var width=$(window).width();//获取当前屏幕的宽度
        //判断当前是不是移动端
        var isMobile=false;
        if(width<=768){    //小于或这样768px时认为是移动设备
            isMobile=true;
        }
        //获取数据
        getData(function(data){
            //根据设备来解析数据
            var templatePoint=_.template($('#template_point').html());
            var templateImage=_.template($('#template_image').html());
            var htmlPoint=templatePoint({model:data});
            var htmlImage=templateImage({model:data,isMobile:isMobile});
            //渲染
            $('.carousel-indicators').html(htmlPoint);
            $('.carousel-inner').html(htmlImage);
        });
    };
    //当页面尺寸改变的时候重新渲染，监听页面尺寸的改变，resize
    $(window).on('resize',function(){
        render();
    }).trigger('resize')
    // 在移动端  手动划动
    var startX=0;
    var moveX=0;
    var distanceX=0;
    var isMobile=false;
    $('.carousel-inner').on('touchstart',function(e){
        startX=e.originalEvent.touches[0].clientX;
    });
    $('.carousel-inner').on('touchmove',function(e){
        moveX=e.originalEvent.touches[0].callback;
        distanceX=moveX-startX;
        isMobile=true;
    });
    $('carousel-inner').on('touchend',function(e){
        if(Math.abs(distanceX)>50&&isMobile){
            if(distanceX>0){
                //上一张
                $('.carousel').carousel('prev');
            }else{
                //下一张
                $('.carousel').carousel('next');
            }
        }
        //重置参数
        startX=0;
        moveX=0;
        distanceX=0;
        isMobile=false;
    });
}