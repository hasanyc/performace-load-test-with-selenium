#!/bin/bash
set -e
freeMem=`awk '/MemFree/ { print int($2/1024) }' /proc/meminfo`
s=$(($freeMem/10*8))
x=$(($freeMem/10*8))
n=$(($freeMem/10*2))
export JVM_ARGS="-Xmn${n}m -Xms${s}m -Xmx${x}m"
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export DEFAULT_REGION=us-east-1

echo "START Running Jmeter on `date`"
echo "JVM_ARGS=${JVM_ARGS}"
echo "jmeter args=$@"
ls -l /test/
# Keep entrypoint simple: we must pass the standard JMeter arguments
jmeter -n -t /test/LG_STG_FINAL.jmx -l report.jtl
jmeter -g /test/report.jtl -f -o /test/report

echo "Uploading test logs into jmeteresults/upload folder"
aws s3 cp /test/report/ s3://jmeteresults/upload/ --recursive

echo "Uploading Completed.Cleaning Local logs"
rm myscript.*

