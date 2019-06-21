# ab 测试结果分析

```
E:\WorkSpace_Webstorm\X-Admin-Generator-Vue>ab -n 1000 -c 20 http://47.93.49.248/x-webdesktop-api/v3.0.1/Platform/user/application/list?x-key=eyJhbGciOiJIUzI1
NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiYWRtaW4iLCJuYW1lIjoi566h55CG5ZGYIiwidXNlcklkIjoxLCJ0eXBlIjowLCJzdGF0dXMiOjEsImlhdCI6MTU2MTAxODI4OSwiZXhwIjoxNTYxMTA0Njg5f
Q.rSKLa-aNwLqMrPwFDB5HXnpFheg94L7CmdFXsPMOIFc
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 47.93.49.248 (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests

// 服务器软件信息
Server Software:        nginx
Server Hostname:        47.93.49.248
Server Port:            80

// 请求的文档路径
Document Path:          /x-webdesktop-api/v3.0.1/Platform/user/application/list?x-key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiYWRtaW4iLCJuYW1lIjo
i566h55CG5ZGYIiwidXNlcklkIjoxLCJ0eXBlIjowLCJzdGF0dXMiOjEsImlhdCI6MTU2MTAxODI4OSwiZXhwIjoxNTYxMTA0Njg5fQ.rSKLa-aNwLqMrPwFDB5HXnpFheg94L7CmdFXsPMOIFc
// 请求的文档大小
Document Length:        17494 bytes

// 并发级别（并发数），与-c参数相等
Concurrency Level:      20
// 测试用时
Time taken for tests:   91.695 seconds
// 完成请求数
Complete requests:      1000
// 失败请求数
Failed requests:        0
// 总的数据传输量
Total transferred:      17964000 bytes
// html内容传输量
HTML transferred:       17494000 bytes

// 请求的文档路径
Document Path:          /x-webdesktop-api/v3.0.1/Platform/user/application/list?x-key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJhY2NvdW50IjoiYWRtaW4iLCJuYW1lIjoi566h55CG5ZGYIiwidXNlcklkIjoxLCJ0eXBlIjowLCJzdGF0dXMiOjEsImlhdCI6MTU2MTAxODI4OSwiZXhwI
joxNTYxMTA0Njg5fQ.rSKLa-aNwLqMrPwFDB5HXnpFheg94L7CmdFXsPMOIFc
// 请求的文档大小
Document Length:        17494 bytes

// 并发级别（并发数），与-c参数相等
Concurrency Level:      20
// 测试用时
Time taken for tests:   91.695 seconds
// 完成请求数
Complete requests:      1000
// 失败请求数
Failed requests:        0
// 总的数据传输量 
Total transferred:      17964000 bytes
// html内容传输量
HTML transferred:       17494000 bytes
// QPS：平均(mean)每秒完成的请求数，计算公式：Complete requests/Time taken for tests 1000/91.695 = 10.91
Requests per second:    10.91 [#/sec] (mean)
// 用户实际感受到的完成一个请求的耗时，由于当前并发20，服务器完成20个请求，平均每个用户才接收到一个完整的返回，所以该值是 `Time per request` 的20倍
Time per request:       1833.902 [ms] (mean)
// 服务器完成一个请求的平均耗时
Time per request:       91.695 [ms] (mean, across all concurrent requests)
// 传输率，对于大文件的请求测试，这个值很容易成为系统瓶颈所在。要确定该值是不是瓶颈，需要了解客户端和被测服务器之间的网络情况，包括网络带宽和网卡速度等信息。
Transfer rate:          191.32 [Kbytes/sec] received

// 连接时间
Connection Times (ms)
              min  mean[+/-sd] median   max
// 网络连接
Connect:        3   81 805.4      5    9014
// 系统处理
Processing:    44 1750 3255.0    211   17952
// 等待
Waiting:       10 1046 2735.2     91   10082
Total:         48 1831 3314.9    231   17957

// 上面这个表格主要是针对响应时间也就是第一个Time per request进行细分和统计。
// 一个请求的响应时间可以分成网络连接（Connect），系统处理（Processing）和等待（Waiting）三个部分；
// min：最小值； 
// mean：平均值，[+/-sd]表示标准差（Standard Deviation） ，也称均方差（mean square error），表示数据的离散程度，数值越大表示数据越分散，系统响应时间越不稳定；
// median：中位数；
// max：最大值。

// 需要注意的是表中的Total并不等于前三行数据相加，因为前三行的数据并不是在同一个请求中采集到的，可能某个请求的网络延迟最短，但是系统处理时间又是最长的呢。所以Total是从整个请求所需要的时间的角度来统计的。这里可以看到最慢的一个请求花费了17957ms，这个数据可以在下面的表中得到验证。

// 在特定时间内（ms）提供的请求的百分比
Percentage of the requests served within a certain time (ms)
// 50%的请求是在231ms内完成的。
  50%    231
  66%    367
  75%   1099
  80%   1730
  90%   9106
  95%   9155
  98%   9368
  99%   9742
// 100%的请求是在17957ms内完成的，这也是最慢的一个请求，与上面的Total中的max值相等。
 100%  17957 (longest request)

```
