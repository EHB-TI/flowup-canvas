echo "IP2021" | sudo -S docker stop heartbeat
echo "IP2021" | sudo -S docker stop receiver

echo "IP2021" | sudo -S docker-compose down -v
echo "IP2021" | sudo -S docker-compose up -d --build