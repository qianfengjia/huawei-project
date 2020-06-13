!function($){
    const $form=$('form');
    const $username=$('.username');
    const $password=$('.password');
    const $repass=$('.repass');
    const $spans=$('.tishi');

    // 锁
    let userflag=true;
    let passflag=true;
    let repassflag=true;

    //用户名
    $username.on('focus',function(){
        $spans.eq(0).html('数字，字母组成，7~14个字符').css({
            color:'#666'
        });
    });

    $username.on('blur',function(){
        console.log(1);
        
        if($(this).val() !==''){
            let len =$(this).val().length;
            if(len<15 && len>6){
                $.ajax({
                    type:'post',
                    url:'http://10.31.162.26/huawei-project/php/registry.php',
                    data:{
                        username:$username.val()
                    }
                }).done(function(result){
                    if(!result){
                        $spans.eq(0).html('√').css('color', 'green');
                        userflag=true;
                    }else{
                        $spans.eq(0).html('该用户名已经存在').css('color', 'red');
                        userflag=false;
                    }
                })
            }else{
                $spans.eq(0).html('重新输入').css({
                    color:'red'
                });
                userflag=false;
            }
        }else{
            $spans.eq(0).html('不能为空').css({
                color:'red'
            });
            userflag=false;
        }
    })

    // 密码
    $password.on('focus',function(){
        $spans.eq(1).html('8~14个字符,包含2种字符').css({
            color:'#666'
        });
    });

    $password.on('input',function(){
        let $pass=$(this).val();
        if($pass.length>7 && $pass.length<15){
            let regnum = /\d+/;
            let reglower=/[a-z]+/;
            let regupper=/[A-Z]/;
            let regother=/[\W\_]+/;
            let $count=0;

            if(regnum.test($pass)){
                $count++;
            }
            if(reglower.test($pass)){
                $count++;
            }
            if(regupper.test($pass)){
                $count++;
            }
            if(regother.test($pass)){
                $count++;
            }
            switch($count){
                case 1:
                    $spans.eq(1).html('弱').css({color:'red'});
                    passflag=false;
                    break;
                case 2:
                case 3:
                    $spans.eq(1).html('中').css({color:'yellow'});
                    passflag=true;
                    break;
                case 4:
                    $spans.eq(1).html('强').css({color:'green'});
                    passflag=true;
                    break;
            }
        }else{
            $spans.eq(1).html('长度有错').css({
                color:'red'
            });
            passflag=false;
        }
    });


    $password.on('blur',function(){
        if($(this).val()!==''){
           if(passflag){
               $spans.eq(1).html('√').css({color:'green'});
               passflag=true;
           }
        }else{
            $spans.eq(1).html('密码不为空').css({color:'red'});
            passflag=false;
        }
    });


// 重复密码
    $repass.on('blur',function(){
        if($(this).val()!==$password.val()){
            $spans.eq(2).html('密码错误').css({color:'red'});
            repassflag=false;
        }else{
            $spans.eq(2).html('√').css({color:'green'});
            repassflag=true;
        }
    })


// 表单提交
$form.on('submit',function(){
    if($username.val()===''){
        $spans.eq(0).html('用户名不为空').css({color:'red'});
        userflag=false;
    }

    if($password.val()===''){
        $spans.eq(1).html('密码不为空').css({color:'red'});
        passflag=false;
    }

    if(!userflag || !passflag || !repassflag){
        return false;
    }
});







}(jQuery);