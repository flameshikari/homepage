FROM ubuntu:latest AS build
COPY ./ /site
WORKDIR /site
RUN bash build.sh

FROM ondh/nginx-fancyindex:latest
COPY --from=build /site/public /site
COPY --from=build /site/nginx/. /etc/nginx/
WORKDIR /site
