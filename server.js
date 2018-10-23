const compression = require('compression');
const express = require('express');
const fs = require('fs');//引入文件读取模块
const mime = require('mime');//解析文件类型
const app = express();
const documentRoot = '/webHtml';//需要访问的文件的存放目录
var reqNum = [];    //用来记录基础路径
app.use(compression());
app.get('*',(req,res,next)=>{
    var url = '';
    if(req.url.indexOf('.')===-1){
        reqNum.push({value:req.url})  
        url = req.url+'/index.html'
    }else{
        url = reqNum[reqNum.length-1].value + req.url
    }
    var file = documentRoot + url;
    console.log('路径:'+file+'文件类型:'+mime.getType(file))
    fs.readFile( file ,  function(err,data){
    /*
        一参为文件路径
        二参为回调函数
            回调函数的一参为读取错误返回的信息，返回空就没有错误
            二参为读取成功返回的文本内容
    */
        if(err){
            fs.readFile( '/webHtml/404/index.html' ,  function(er,data){
                res.writeHeader(404,{
                    'content-type' : 'text/html;charset="utf-8"'
                });
                res.write(data);
                res.end();
            })
        }else{
            res.writeHeader(200,{
                'content-type' : mime.getType(file),
                'Cache-Control':'no-cache'
            });
            res.write(data);//将index.html显示在客户端
            res.end();

        }

    });
})
var server = app.listen(80,()=>{
    console.log('服务器开启成功');
})
