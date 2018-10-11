FROM nginx:1.13.3-alpine
ARG ESKAYSOFT_URL="https://s3.amazonaws.com/eskaysoft-releases/eskaysoft-latest.tar.gz"
ENV ESKAYSOFT_PATHS_HOME="/usr/share/nginx/html"
## Copy our default nginx config
RUN apk add --update curl
COPY nginx/default.conf /etc/nginx/conf.d/
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
RUN curl "$ESKAYSOFT_URL" | tar xfvz - --strip-components=1 -C "$ESKAYSOFT_PATHS_HOME"
CMD ["nginx", "-g", "daemon off;"]