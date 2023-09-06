#node patch  if some error, run node patch after npm i
#export NODE_OPTIONS=--openssl-legacy-provider
export NODE_OPTIONS=--openssl-legacy-provider && ng build --configuration=production --aot=true --optimization=true
