# drawinggame

Ideally build a docker image 

docker build -t counter-image -f DrawingGame/Dockerfile .

then you can run it 

sudo docker run -d -p 8080:80 --name Drawing counter-image

or you know, push it to your container repository and pull it to your server

https://drawing.igocode.com
