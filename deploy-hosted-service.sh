set -o allexport
source .env
set +o allexport

yarn graph auth --product hosted-service $ACCESS_TOKEN_HOSTED

yarn graph deploy --product hosted-service $GRAPH_URL_HOSTED