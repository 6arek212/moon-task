# Delayed Task Node.ts Server

This is a highly scalable Node.js server application that provides a single API, delayedTask. This API receives a message and a specified time, storing the task in Redis and printing the message at the specified time. The server utilizes Redis streams and consumer groups to ensure scalability, durability, and resilience across server restarts.

![1_IOg5-gQnDynx8HjDe7YuRg](https://github.com/user-attachments/assets/b543bb2f-bf77-4dcb-b83a-6b241a6c0774)

## How To Run

run the following commands first:

    npm i

<br/>
to run redis on docker or change the redis host/port in the configs/index.ts file

    docker-compose up -d

<br/>

    npm start

<br/>

use the **calls.http** file to send an http request / or just use postman

    POST http://localhost:5000/api/tasks/delayedTask
    Content-Type: application/json

    {
        "time": "2024-11-07T22:49:00+02:00",
        "message":"my message"
    }

## Features

- **Persistence** with Redis: Tasks are stored in Redis streams, ensuring durability even in the event of a server restart.

- **Scalability**: The application leverages Redis streams and consumer groups to distribute tasks across multiple consumers, making it horizontally scalable.
- **Resilience**: The application reschedules tasks which were no acknowledged by the current consumer.
