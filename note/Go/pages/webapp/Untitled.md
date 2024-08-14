https://youtu.be/W5b64DXeP0o?si=dUGJcHl-inLXAh5X

hi everyone its Elliott from tutorial eyes done it and and that's the toriel I'm going to be showing you exactly how you can create your own incredibly simple REST API using Gore now as always the full text version of this tutorial is available on my website and I believe in a link to this tutorial and the description below so rest as everywhere these days from website is to enterprise applications the rest will architecture still as a powerful we are providing communication between separate software components now

[00:38](https://www.youtube.com/watch?v=undefined&t=38s)

if you wish to learn more about REST API s then I've got an article titled what our REST API is and again I'll leave a link to that in the description below so coming into our favorite code editor of choice we're going to get started and create a very simple server which can handle HTTP requests now to get started we're gonna create a file called mint go with an S min that go fail we're gonna want to create three distinct functions a home page function that will handle all requests to our root URL a handle

[01:13](https://www.youtube.com/watch?v=undefined&t=73s)

request function that will match the URL path had West a function defined and the main function which will act as the entry point to our simple rest server so let's get started package min let's close this and then we'll define our list of M ports so M poor fmt log and we're gonna want to define net HTTP fix that well that's we're gonna want to define our home page function and this is gonna take an hour response writer and our requests and within the body of this homepage function we're gonna want

[02:06](https://www.youtube.com/watch?v=undefined&t=126s)

to do the following so f mt dou f for an f w homepage endpoint ahead perfect and next we want to define our handle requests function so func handle requests and with the nest we're gonna want to do HTTP handle funk and we're gonna want to map the route path to our home page funk and then finally with the nest we're gonna want to do log don't fatal HTTP dot lesson and serve and we're gonna want to do this on port 8081 so I know that's free and my current machine finally wants to find the entry point to our

[03:03](https://www.youtube.com/watch?v=undefined&t=183s)

application so funk me and call handle requests perfect coming into our terminal we can now try and run this simple application by calling go run and the name of Rafael Mingo and when we hit localhost port 8081 and our browser with a simple get request you should see that it successfully returns home page endpoint head fantastic so now that we've got a basic server up and running let's extend this and create our first API endpoint that returns a JSON response of a list of articles that we have to find it in

[03:45](https://www.youtube.com/watch?v=undefined&t=225s)

memory to get started let's define an article structure or struct so right at the top of your code just below your imports tape article strap and these are gonna have the following so title which will be of type string Jason title next will be description of tape string as well and you'll find it in Jason as the script all right just disk finally we'll have content which will also be able to tape string and the Jason path for that will be content blue that's we're gonna want to define tape articles which will be an

[04:38](https://www.youtube.com/watch?v=undefined&t=278s)

array of article now that we've set up our article structure we can start mocking up some API endpoints that we can head to retrieve some data so the first one we're gonna do is the all articles function so funk all articles and this is gonna take an HTTP response writer and I request within the body of this function we're gonna want to do the following so FM t dot print line if I can spell endpoint that all articles endpoint and we want to do Jason thought new encoder w and we went to encode an articles

[05:45](https://www.youtube.com/watch?v=undefined&t=345s)

array that we're gonna find just at the top of this function the articles equals article and with an S we want to do article give a title test title give a description of test description and give it some content so hello world finally what we need to do is import the encoding / Jason lively and that should fix all of our issues and fatally we want to register our function so HTTP dot handle funk and whenever we had articles we wanted to return with the

[06:51](https://www.youtube.com/watch?v=undefined&t=411s)

function all articles like so again come into your command line and type run go run min go when we next go into our browser and we had the articles path you should see that it returns a JSON response with the article that we have just defined within that the body of that all articles function so that says create a really simple really basic REST API that returns a series of articles based on a get request made to a particular URL now in the next tutorial I'm going to show you how you can effectively refactor this and you

[07:34](https://www.youtube.com/watch?v=undefined&t=454s)

utilize a gorilla mocks Ritter and then start to explore different HTTP verbs such as the get put post update and delete verbs and how you can effectively use them to perform different actions within your REST API now hopefully you found this tutorial useful if you did I would really appreciate it if you left a like in the video and subscribe to my channel for more programming based tutorials Cheers