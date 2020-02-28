FROM node:10
RUN npm install -g postgraphile postgraphile-plugin-nested-mutations postgraphile-plugin-connection-filter @graphile-contrib/pg-simplify-inflector

EXPOSE 5001
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]
