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

## Solutions Considered

1- This solution involves using **Redis sorted sets** to store delayed tasks, where each task's scheduled time is set as its score. A consumer periodically reads tasks with a score less than or equal to the current timestamp (Date.now()) to determine if they should be processed, limiting the results to a single task per query.

To scale this solution, we would require locks on each message to ensure that only one consumer processes any given task. However, this approach is limited in scalability due to potential contention issues: all consumers will read the same message and only one will acquire the lock to process it. Consequently, even with multiple consumers (N consumers) and N tasks, only one task can be processed at a time, restricting the throughput and diminishing the benefits of horizontal scaling.

2- **Picked this one:** Redis Streams and Consumer groups
In this solution, a producer inserts tasks into a Redis stream, where they are picked up by one of the consumers in a consumer group. This setup allows seamless scaling of both producers and consumers without any concurrency issues, as Redis consumer groups ensure that each task is delivered to only one consumer within the group.

Additionally, each consumer process a task and acknowledged it, Unacknowledged tasks can be re-read and rescheduled, ensuring reliable task processing even in cases where a consumer crashes or loses connection. This approach offers both scalability and resilience, making it well-suited for high-throughput environments.

## Features

- **Persistence** with Redis: Tasks are stored in Redis streams, ensuring durability even in the event of a server restart.

- **Scalability**: The application leverages Redis streams and consumer groups to distribute tasks across multiple consumers, making it horizontally scalable.
- **Resilience**: The application reschedules tasks which were no acknowledged by the current consumer.
