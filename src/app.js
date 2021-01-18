const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const checkID = (request, response, next) => {
  const {id} = request.params

  if(!isUuid(id)) {
    return response.status(400).json({error: "The id is not valid"})
  }

  next()
}

app.use("/repositories/:id", checkID)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const repository = {
    id: uuid(),
    likes: 0,
    ...request.body
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const repoIndex= repositories.findIndex(r => r.id === request.params.id)

  if(repoIndex < 0) {
    return response.status(400).json({error: "This ID does not exist"})
  }

  const {likes, id} = repositories[repoIndex]

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    ...request.body,
    likes,
    id
  }

  console.log(repositories[repoIndex])

  return response.json(repositories[repoIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const repoIndex = repositories.findIndex(r => r.id === request.params.id)

  if(repoIndex < 0) {
    return response.status(400).json({error: "This ID does not exist"})
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const repoIndex = repositories.findIndex(r => r.id === request.params.id)

  if(repoIndex < 0) {
    return response.status(400).json({error: "This ID does not exist"})
  }

  const { likes } =  repositories[repoIndex]

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    likes: likes + 1
  }

  return response.json(repositories[repoIndex])

});

module.exports = app;
