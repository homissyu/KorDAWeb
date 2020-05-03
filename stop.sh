kill -9 `netstat -tnlp|grep 8080 |gawk '{ print $7 }'|grep -o '[0-9]*'`
