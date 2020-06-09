<?php

//设置跨域的header
header('Access-Control-Allow-Origin:*');  //允许跨域的网址，*所有的网址。
header('Access-Control-Allow-Method:POST,GET'); //允许跨域的请求方式。

//php引入公共文件
require "conn.php";

$result = $conn->query("select * from taobaogoods");

$taobaoarr = array();

for ($i = 0; $i < $result->num_rows; $i++) {
    $taobaoarr[$i] = $result->fetch_assoc();
}

echo json_encode($taobaoarr);
