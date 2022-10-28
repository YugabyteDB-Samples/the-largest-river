# base section
# YugabyteDB image uses workspace-full as the base image. This base image comes pre-built
# with language-specific runtimes, tools, and libraries.

FROM gitpod/workspace-full

ENV TRIGGER_REBUILD=1
ARG YB_VERSION=2.14.4.0
ARG YB_BUILD=26
ARG YB_BIN_PATH=/usr/local/yugabyte
ARG ROLE=gitpod

USER $ROLE
# create bin and data path
RUN sudo mkdir -p $YB_BIN_PATH \
    && sudo mkdir -p /var/ybdp
# set permission
RUN sudo chown -R $ROLE:$ROLE /var/ybdp \
    && sudo chown -R $ROLE:$ROLE /usr/local/yugabyte


# fetch the binary
RUN curl -sSLo ./yugabyte.tar.gz https://downloads.yugabyte.com/releases/${YB_VERSION}/yugabyte-${YB_VERSION}-b${YB_BUILD}-linux-x86_64.tar.gz \
    && tar -xvf yugabyte.tar.gz -C $YB_BIN_PATH --strip-components=1 \
    && chmod +x $YB_BIN_PATH/bin/* \
    && rm ./yugabyte.tar.gz

# configure the interpreter
RUN ["/usr/local/yugabyte/bin/post_install.sh"]

# set the execution path and other env variables
ENV PATH="$YB_BIN_PATH/bin/:$PATH"
ENV STORE=/var/ybdp
ENV YSQL_PORT=5433
ENV YCQL_PORT=9042
ENV WEB_PORT=7000
ENV TSERVER_WEB_PORT=9000
ENV YSQL_API_PORT=13000
ENV YCQL_API_PORT=12000

EXPOSE ${YSQL_PORT} ${YCQL_PORT} ${WEB_PORT} ${TSERVER_WEB_PORT} ${YSQL_API_PORT} ${YCQL_API_PORT}