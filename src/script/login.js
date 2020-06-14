!function($){

    $('.btn').on('click',function(){
        console.log($('#username').val(),hex_sha1($('#password').val()));

        if($('#username').val()!==''&& $('#password').val()!==''){
            $.ajax({
                type:'post',
                url:'http://10.31.162.26/huawei-project/php/login.php',
                data:{
                    username:$('#username').val(),
                    password:hex_sha1($('#password').val())
                }
            }).done(function(result){
                if (result) {
                    location.href = "index.html";
                    localStorage.setItem('username', $('#username').val());
                } else {
                    $('#password').val('');
                    alert('用户名或者密码错误');
                }
            })
        }else{
            alert('请输入信息')
            return false;
        }

    })
}(jQuery);



