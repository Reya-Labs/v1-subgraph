set -o allexport
source .env
set +o allexport

: ${ACCESS_TOKEN:?"Need to set ACCESS_TOKEN non-empty"}
: ${GITHUB_USER:?"Need to set GITHUB_USER non-empty"}
: ${SUBGRAPH_NAME:?"Need to set SUBGRAPH_NAME non-empty"}
 
yarn graph auth --product hosted-service $ACCESS_TOKEN

read -p "Deploy current subgraph to $GITHUB_USER/$SUBGRAPH_NAME? [y/n] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if [[ "$SUBGRAPH_NAME" == "mainnet-v1" ]]
    then
        echo "\033[33;31mYou are about to overwrite the MAINNET subgraph $GITHUB_USER/$SUBGRAPH_NAME."
        read -p "ARE YOU SURE YOU WANT TO PROCEED? [type the subgraph name to confirm] " -r
        echo
        if [[ ! "$REPLY" == "mainnet-v1" ]]
        then
            exit 0
        fi
    fi
    
    yarn graph deploy --product hosted-service $GITHUB_USER/$SUBGRAPH_NAME
fi
