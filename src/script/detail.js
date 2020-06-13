!function($){
    let $sid=location.search.substring(1).split('=')[1];

    const $topdet_pic=$('.topdet_pic');//左框
    const $bpic=$('.bpic');//右图
    const $spic=$('.spic');//左图

    if(!$sid){  //如果$sid不存在，默认$sid = 1
        $sid=1;
    }

    // 将sid传给后端
    $.ajax({
        url:'http://10.31.162.26/huawei-project/php/getsid.php',
        data:{sid:$sid},
        dataType:'json'
    }).done(function(d){
        console.log(d);
        $spic.attr('src',d.url);//左图添加src
        $spic.attr('sid',d.sid);
        $bpic.attr('src',d.url);
        console.log(d.piclisturl.split(','));//一组小图
        //渲染一组小图
        let picarr=d.piclisturl.split(',');
        let $strhtml='';
        $.each(picarr,function(index,value){
            $strhtml+='<li><img src="'+value+'"></li>';
        });
        $('.botdet_pic ul').html($strhtml);
    });


    //放大镜效果
    const $fdj=$('.fdj');//小放
    const $jz=$('.jz');//大放

    //小放/大放=小图/大图
    $fdj.width($spic.width() * $jz.width() / $bpic.width());
    $fdj.height($spic.height() * $jz.height() / $bpic.height());
    let $bili = $bpic.width() / $spic.width();

    $topdet_pic.hover(function() {
        $fdj.css('visibility', 'visible');
        $jz.css('visibility', 'visible');
        $(this).on('mousemove', function(ev) {
            let $leftvalue = ev.pageX - $('.detail').offset().left - $fdj.width() / 2;
            let $topvalue = ev.pageY - $('.detail').offset().top - $fdj.height() / 2;
            if ($leftvalue < 0) {
                $leftvalue = 0;
            } else if ($leftvalue >= $spic.width() - $fdj.width()) {
                $leftvalue = $spic.width() - $fdj.width()
            }

            if ($topvalue < 0) {
                $topvalue = 0;
            } else if ($topvalue >= $spic.height() - $fdj.height()) {
                $topvalue = $spic.height() - $fdj.height()
            }

            $fdj.css({
                left: $leftvalue,
                top: $topvalue
            });

            $bpic.css({
                left: -$leftvalue * $bili,
                top: -$topvalue * $bili
            });
        });
    },function(){
        $fdj.css('visibility', 'hidden');
        $jz.css('visibility', 'hidden');
    });
  
    
    // 购物车
    let arrsid = []; //存储商品的编号
    let arrnum = []; //存储商品的数量

    function cookietoarray() {
        if ($.cookie('cookiesid') && $.cookie('cookienum')) {
            arrsid = $.cookie('cookiesid').split(','); //获取cookie 同时转换成数组。[1,2,3,4]
            arrnum = $.cookie('cookienum').split(','); //获取cookie 同时转换成数组。[12,13,14,15]
        } else {
            arrsid = [];
            arrnum = [];
        }
    }

    $('.join').on('click', function() {
        //获取当前商品对应的sid
        let $sid = $(this).parents('.detail').find('.spic').attr('sid');
        cookietoarray();
        if ($.inArray($sid, arrsid) != -1) { //$sid存在，商品列表存在，数量累加
            let $num = parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($('#count').val()); //取值
            arrnum[$.inArray($sid, arrsid)] = $num; //赋值
            $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
        } else {
            arrsid.push($sid); //将编号$sid push到arrsid数组中
            $.cookie('cookiesid', arrsid, { expires: 10, path: '/' });
            arrnum.push($('#count').val()); //将数量push到arrnum数组中
            $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
        }
        alert('确定加入购物车？');
    });

}(jQuery);