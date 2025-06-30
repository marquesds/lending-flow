# Lending Flow

A NestJS and Temporal implementation roughly simulating a mock lending flow.

## Installing

```shell
$ pnpm install
```

## Running Temporal

```shell
$ temporal server start-dev # you need to install Temporal first - brew install temporal
```

## Running both controllers and Temporal worker

```shell
$ pnpm run start:dev
```

## Executing the Workflow

```shell
$ curl -X POST "http://localhost:3000/lending/start" \
    -d '{
      "name": "Lucas Marques",
      "amount": "10000.00",
      "term": 36,
      "person_credit_score": 720,
    }'
```

Output: Workflow ID.

## Getting the APR value

```shell
$ curl -X GET "http://localhost:3000/lending/workflow/<WORKFLOW_ID>/apr"
```

Output: APR value.

## Accepting the terms

```shell
$ curl -X POST "http://localhost:3000/lending/workflow/<WORKFLOW_ID>/accept-terms" \
  -d '{"accepted": true}'
```
