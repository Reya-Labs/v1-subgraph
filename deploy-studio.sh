set -o allexport
source .env
set +o allexport

yarn graph auth --studio $DEPLOY_TOKEN_STUDIO

yarn graph deploy --studio $GRAPH_URL_STUDIO