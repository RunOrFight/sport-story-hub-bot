#!/bin/bash

docker ps -a --format '{{.Names}}' | grep -e 'sport_hub_web' -e 'sport_hub_server' | xargs docker rm

docker images --format '{{.Repository}}:{{.Tag}}' | grep -e 'sport-story-hub-bot-web_app' -e 'sport-story-hub-bot-server_app' | xargs docker rmi

