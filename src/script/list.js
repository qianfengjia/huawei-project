

! function($) {
    const header=$('header');
    header.load('./common.html');
    const footer=$('footer');
    footer.load('./footer.html');

    let array_default = []; //排序前的li数组
    let array = []; //排序中的数组
    let prev = null;
    let next = null;


    //1.渲染列表页的数据-默认渲染第一页
    const $part = $('.part');
    $.ajax({
        url: 'http://10.31.162.26/huawei-project/php/listdata.php', //默认获取后端接口的10条
        dataType: 'json'
    }).done(function(data) {
        // console.log(data);  
        let $strhtml = '<ul>';
        $.each(data, function(index, value) {
            $strhtml += `
                <li>
                    <a href="details.html?sid=${value.sid}">
                        <img class="lazy" data-original="${value.url}" />
                        <p>${value.sid}${value.title}</p>
                        <span class="price">￥${value.price}</span>
                    </a>
                </li>
            `;
        });
        $strhtml += '</ul>';
        $part.html($strhtml);

        //添加懒加载,添加到渲染的列表下面
        $(function() {
            $("img.lazy").lazyload({ effect: "fadeIn" });
        });

        array_default = []; //排序前的li数组
        array = []; //排序中的数组
        prev = null;
        next = null;
        //将页面的li元素加载到两个数组中
        $('.part li').each(function(index, element) {
            array[index] = $(this);
            array_default[index] = $(this);
        });
    });
    //渲染的外部无法获取内部的元素对象，通过事件委托实现。

    //2.分页思路
    $('.page').pagination({
        pageCount: 3, //总的页数
        jump: true, //是否开启跳转到指定的页数，布尔值。
        coping: true, //是否开启首页和尾页，布尔值。
        prevContent: '上一页',
        nextContent: '下一页',
        homePage: '首页',
        endPage: '尾页',
        callback: function(api) {
            console.log(api.getCurrent()); //获取的当前点击的页码
            $.ajax({
                url: 'http://10.31.162.26/huawei-project/php/listdata.php',
                data: {
                    page: api.getCurrent() //传递页码
                },
                dataType: 'json'
            }).done(function(data) {
                let $strhtml = '<ul>';
                $.each(data, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="details.html?sid=${value.sid}" target="_blank">
                                <img src="${value.url}"/>
                                <p>${value.sid}${value.title}</p>
                                <span class="price">￥${value.price}</span>
                            </a>
                        </li>
                    `;
                });
                $strhtml += '</ul>';
                $part.html($strhtml);

                //重新赋值
                array_default = []; //排序前的li数组
                array = []; //排序中的数组
                prev = null;
                next = null;
                //将页面的li元素加载到两个数组中
                $('.part li').each(function(index, element) {
                    array[index] = $(this); //排序的
                    array_default[index] = $(this); //重置的
                });


            })
        }
    });

    //3.排序
    //默认排序-重置
    $('.button').on('click', function() {
        $.each(array_default, function(index, value) {
            $('.part ul').append(value);
        });
        return;
    });-
    //价格升序
    $('.icon-iconfontyoujiantou').on('click', function() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                prev = parseFloat(array[j].find('.price').html().substring(1));
                next = parseFloat(array[j + 1].find('.price').html().substring(1));
                //通过价格的判断，改变的是li的位置。
                if (prev > next) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
      
        $.each(array, function(index, value) {
            console.log(value); //n.fn.init [li, context: li]
            $('.part ul').append(value);
        });
    });
    //价格降序
    // $('button').eq(2).on('click', function() {
    $('.icon-bottom-arrow').on('click', function() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                prev = parseFloat(array[j].find('.price').html().substring(1));
                next = parseFloat(array[j + 1].find('.price').html().substring(1));
                //通过价格的判断，改变的是li的位置。
                if (prev < next) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        // $('.list ul').empty();//清空原来的列表
        $.each(array, function(index, value) {
            $('.part ul').append(value);
        });
    })


}(jQuery);