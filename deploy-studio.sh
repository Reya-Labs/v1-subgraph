set -o allexport
source .env
set +o allexport

: ${DEPLOY_TOKEN_STUDIO:?"Need to set DEPLOY_TOKEN_STUDIO non-empty"}
: ${SUBGRAPH_NAME:?"Need to set SUBGRAPH_NAME non-empty"}
 
yarn graph auth --studio $DEPLOY_TOKEN_STUDIO

read -p "Deploy current subgraph to $SUBGRAPH_NAME? [y/n] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if [[ "$SUBGRAPH_NAME" == "voltz-mainnet" ]]
    then
        echo "\033[33;31mYou are about to overwrite the MAINNET subgraph $SUBGRAPH_NAME."
        read -p "ARE YOU SURE YOU WANT TO PROCEED? [type the subgraph name to confirm] " -r
        echo
        if [[ ! "$REPLY" == "voltz-mainnet" ]]
        then
            exit 0
        fi
    fi
    
    yarn graph deploy --studio $SUBGRAPH_NAME
fi
