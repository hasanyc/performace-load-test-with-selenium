FROM amazonlinux:latest
MAINTAINER lgcms.com

# Install packages
RUN yum update && \
    yum install ca-certificates wget python python-dev py-pip && \ 
    update-ca-certificates && \
    pip install --upgrade --user awscli

# Setting environment variables
ENV JMETER_HOME /opt/apache-jmeter-5.4.1
ENV JMETER_BIN	${JMETER_HOME}/bin
ENV TESTDIR /test/
ENV PATH="~/.local/bin:$PATH"


RUN yum upgrade
RUN yum update
RUN yum install --no-cache bash
RUN yum install curl
# Downloading JMETER and copying into the opt path
RUN curl -L --silent https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.4.1.tgz > /tmp/apache-jmeter-5.4.1.tgz
RUN tar -xzf /tmp/apache-jmeter-5.4.1.tgz -C /opt
#RUN wget https://jmeter-plugins.org/get/ -O /opt/apache-jmeter-5.4.1/lib/ext/jmeter-plugins-manager.jar
ADD https://chromedriver.storage.googleapis.com/96.0.4664.45/chromedriver_linux64.zip /opt/chromedriver_linux64.zip
RUN unzip /opt/chromedriver_linux64.zip -d /usr/local/bin/
RUN ls -al /usr/local/bin/chromedriver*
RUN yum install --update openjdk8-jre tzdata curl unzip bash

ENV PATH $PATH:$JMETER_BIN
WORKDIR	${TESTDIR}
# Copying the JMX file and entrypoint file(this runs the test)
COPY test/LG_STG_FINAL.jmx $TESTDIR
# ADD https://chromedriver.storage.googleapis.com/96.0.4664.45/chromedriver_linux64.zip /test
# RUN unzip /test/chromedriver_linux64.zip -d .
# RUN cp /test/chromedriver /usr/bin/
RUN jmeter --version
RUN /usr/local/bin/chromedriver --version
COPY entrypoint.sh $TESTDIR
# Docker entry point to run the test
RUN ["chmod", "+x", "/test/entrypoint.sh"]
RUN ["./entrypoint.sh"]