#node patch  if some error, run node patch after npm i
export NODE_OPTIONS=--openssl-legacy-provider
ng build --prod --aot=true --optimization=true
