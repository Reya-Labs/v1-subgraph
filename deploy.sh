set -o allexport
source .env
set +o allexport

yarn graph auth --product hosted-service $ACCESS_TOKEN

yarn graph deploy --product hosted-service voltzprotocol/mainnet-v1