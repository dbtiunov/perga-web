#!/bin/sh
sed -i "s|VITE_API_BASE_URL_PLACEHOLDER|${VITE_API_BASE_URL}|g" /usr/share/nginx/html/index.html
sed -i "s|VITE_IS_SIGNUP_DISABLED_PLACEHOLDER|${VITE_IS_SIGNUP_DISABLED}|g" /usr/share/nginx/html/index.html

nginx -g "daemon off;"
