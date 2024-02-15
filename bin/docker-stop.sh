container_ids=$(docker ps -a --filter "name=sport_hub" --format "{{.ID}}")

for container_id in $container_ids; do
    docker stop "$container_id"
done
