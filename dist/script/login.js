"use strict";!function(e){e(".btn").on("click",function(){return console.log(e("#username").val(),hex_sha1(e("#password").val())),""===e("#username").val()||""===e("#password").val()?(alert("请输入信息"),!1):void e.ajax({type:"post",url:"http://10.31.162.26/huawei-project/php/login.php",data:{username:e("#username").val(),password:hex_sha1(e("#password").val())}}).done(function(a){a?(location.href="index.html",localStorage.setItem("username",e("#username").val())):(e("#password").val(""),alert("用户名或者密码错误"))})})}(jQuery);