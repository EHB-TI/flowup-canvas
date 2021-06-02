touch .env

echo "AMQP_URL=amqp://10.3.56.6" >> .env

docker-compose down -v
docker-compose up