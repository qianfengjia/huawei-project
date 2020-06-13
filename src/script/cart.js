!function($){
    // const header=$('header')
    // header.load('./')
    function showlist(sid,num){
        $.ajax({
            url:'http://10.31.162.26/huawei-project/php/alldata.php',
            dataType:'json'
        }).done(function(data){
            $.each(data,function(index,value){
                if(sid==value.sid){
                    let $clonebox = $('.goods:hidden').clone(true, true); //克隆隐藏元素
                    $clonebox.find('.leftpart').find('img').attr('src', value.url);
                    $clonebox.find('.leftpart').find('img').attr('sid', value.sid);
                    $clonebox.find('.rightpart').find('a').html(value.title);
                    $clonebox.find('.p-price').find('em').html(value.price);
                    $clonebox.find('.number').find('input').val(num);
                    //计算单个商品的价格
                    $clonebox.find('.l_price').find('em').html((value.price * num).toFixed(2));
                    $clonebox.css('display', 'block');
                    $('.middle_part').append($clonebox);
                    calcprice(); //计算总价
                }
            });
        });
    }

    if ($.cookie('cookiesid') && $.cookie('cookienum')) {
        let s = $.cookie('cookiesid').split(','); //获取cookie 同时转换成数组[1,2]
        let n = $.cookie('cookienum').split(','); //获取cookie 同时转换成数组[10,20]
        $.each(s, function(index, value) {
            showlist(s[index], n[index]);
        });
    }


 //3.计算总价--使用次数很多--函数封装
 function calcprice() {
    let $sum = 0; //商品的件数
    let $count = 0; //商品的总价
    // console.log(1);
    
    $('.goods:visible').each(function(index, ele) {
        // console.log($(ele).find('input'));
        
        if ($(ele).find('input').prop('checked')) { //复选框勾选
            $sum += parseInt($(ele).find('.number input').val());
            $count += parseFloat($(ele).find('.l_price em').html());
        }
    });
    $('.total_goods').find('em').html($sum);
    $('.total_price').html($count.toFixed(2));
}
calcprice();
//4.全选
$('.topcontent input').on('change', function() {
    $('.goods:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
    $('.topcontent input').prop('checked', $(this).prop('checked'));
    calcprice(); 
});


//
let $inputs = $('.goods:visible').find(':checkbox');
$('.middle_part').on('change', $inputs, function() {
    //$(this):被委托的元素，checkbox
    if ($('.goods:visible').find(':checkbox').length === $('.goods:visible').find('input:checked').size()) {
        $('.topcontent input').prop('checked', true);
    } else {
        $('.topcontent input').prop('checked', false);
    }
    calcprice(); //计算总价
});

 //5.数量+的改变
 $('.number_add').on('click', function() {
    let $num = $(this).parents('.goods').find('.number input').val();
    $num++;
    $(this).parents('.goods').find('.number input').val($num);

    $(this).parents('.goods').find('.l_price em').html(calcsingleprice($(this)));
    calcprice(); //计算总价
    setcookie($(this));
});

//数量-的改变
$('.number_down').on('click', function() {
    let $num = $(this).parents('.goods').find('.number input').val();
    $num--;
    if ($num < 1) {
        $num = 1;
    }
    $(this).parents('.goods').find('.number input').val($num);
    $(this).parents('.goods').find('.l_price em').html(calcsingleprice($(this)));
    calcprice(); //计算总价
    setcookie($(this));
});

$('.number input').on('input', function() {
    let $reg = /^\d+$/g; //只能输入数字
    let $value = $(this).val();
    if (!$reg.test($value)) { //不是数字
        $(this).val(1);
    }
    $(this).parents('.goods').find('.l_price em').html(calcsingleprice($(this)));
    calcprice(); //计算总价
    setcookie($(this));
});

 //计算单价
 function calcsingleprice(obj) { //obj元素对象
    let $dj = parseFloat(obj.parents('.goods').find('.p-price em').html());//单价
    let $num = parseInt(obj.parents('.goods').find('.number input').val());//数量
    return ($dj * $num).toFixed(2)
}


//将改变后的数量存放到cookie中
let arrsid = []; //存储商品的编号
let arrnum = [];
function cookietoarray() {
    if ($.cookie('cookiesid') && $.cookie('cookienum')) {

        arrsid = $.cookie('cookiesid').split(','); //获取cookie 同时转换成数组[1,2,3,4]
        arrnum = $.cookie('cookienum').split(','); 
    } else {
        arrsid = [];
        arrnum = [];
    }
}

// 设置cookie
function setcookie(obj) {
    // console.log(obj);
    cookietoarray();
    let $sid = obj.parents('.goods').find('img').attr('sid');
    arrnum[$.inArray($sid, arrsid)] = obj.parents('.goods').find('.number input').val();
    // console.log(arrsid, arrnum[$.inArray($sid, arrsid)]);
    // console.log(arrnum);
    $.cookie('cookienum', arrnum, 10 );
}

// 删除
function delcookie(sid, arrsid) { //sid:当前删除的sid  arrsid:存放sid的数组[3,5,6,7]
    let $index = -1; //删除的索引位置
    $.each(arrsid, function(index, value) {
        if (sid === value) {
            $index = index;
        }
    });
    arrsid.splice($index, 1);
    arrnum.splice($index, 1);
    $.cookie('cookiesid', arrsid, { expires: 10, path: '/' });
    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
}

 //删除单个
 $('.delate_one').on('click', function() {
    cookietoarray();
    if (window.confirm('你确定要删除吗?')) {
        $(this).parents('.goods').remove();
        delcookie($(this).parents('.goods').find('img').attr('sid'), arrsid);
        calcprice(); //计算总价
    }
});

 //删除多个
 $('.bottomcontent input').on('click', function() {
    cookietoarray();
    if (window.confirm('你确定要全部删除吗?')) {
        $('.goods:visible').each(function() {
            if ($(this).find(':checkbox').is(':checked')) { //判断复选框是否选中
                $(this).remove();
                delcookie($(this).find('img').attr('sid'), arrsid);
            }
        });
        calcprice(); //计算总价
    }
});


// 已经选中几件商品
// console.log(arrsid.size());
console.log($.cookie('cookiesid'));
// $('hadchose').html(arrsid);


}(jQuery);