
# Getting Started
### 1. Install Docker and Docker Compose

#### Docker

To run this project, you need to have Docker installed. If you don’t have Docker installed, you can download and install it from [here](https://www.docker.com/get-started).

- For **Windows** and **Mac**: Follow the installer instructions on the Docker website.
- For **Linux**: Follow the Linux-specific instructions on the Docker installation page.

#### Docker Compose

Docker Compose is typically included with Docker Desktop for Windows and Mac. If you’re on Linux, you may need to install it separately.

- **Linux**: You can install Docker Compose by running the following command:
  
  ```bash
  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```
To verify:
```bash
    docker --version
    docker-compose --version
```

### 2. Build the docker container
After installing Docker and Docker Compose, you can build the Docker container:
```bash
    docker-compose build
```

### 3. View the results
- Start the container. This will start the app server and the db:
```bash
    docker-compose up
```
- Navigate to see output for get routes. Examples of index routes:

    localhost:3000/api/questions
    localhost:3000/api/answers
    localhost:3000/api/users
    localhost:3000/api/comments

    Examples of show routes:

    localhost:3000/api/questions/1
    localhost:3000/api/answers/1
    localhost:3000/api/users/1
    localhost:3000/api/comments/1

- Use curl for creating data:
```bash
curl -X POST http://localhost:3000/api/answers \
  -H "Content-Type: application/json" \
  -d '{ "body":"This is the answer body", "questionId": {replace_valid_question_id}, "userId": {replace_valid_user_id}}'
```

### 4. View the data in the database using prisma studio
    navigate to localhost:5555
    navigate to model User of Question or Comment or Answer
    (prisma studio may take a second or two to boot up after docker-compose up)

# Table Structure

## Question Table

Stores information about each question.

| Column Name | Data Type | Description                                |
|-------------|------------|--------------------------------------------|
| id          | INT        | Primary Key. Unique ID for the question.   |
| title       | TEXT       | The title of the question.                 |
| body        | TEXT       | The body/content of the question.          |
| creation    | BIGINT     | Unix timestamp for when the question was created. |
| score       | INT        | Score of the question.                     |
| user_id     | INT        | Foreign Key. Refers to the user who posted the question. |

## User Table

Stores information about users (both question askers and commenters).

| Column Name | Data Type     | Description                    |
|-------------|---------------|--------------------------------|
| id          | INT           | Primary Key. Unique ID for the user.  |
| name        | VARCHAR(255)  | The name of the user.           |

## Comment Table

Stores information about the comments on both questions and answers.

| Column Name | Data Type | Description                                |
|-------------|------------|--------------------------------------------|
| id          | INT        | Primary Key. Unique ID for the comment.    |
| body        | TEXT       | The content of the comment.                |
| user_id     | INT        | Foreign Key. Refers to the user who posted the comment. |
| question_id | INT        | Foreign Key. Refers to the question.       |
| answer_id   | INT        | Foreign Key. Refers to the answer, if the comment is on an answer. |

## Answer Table

Stores information about answers to the questions.

| Column Name | Data Type | Description                                |
|-------------|------------|--------------------------------------------|
| id          | INT        | Primary Key. Unique ID for the answer.     |
| body        | TEXT       | The body/content of the answer.            |
| creation    | BIGINT     | Unix timestamp for when the answer was created. |
| score       | INT        | Score of the answer.                       |
| user_id     | INT        | Foreign Key. Refers to the user who posted the answer. |
| question_id | INT        | Foreign Key. Refers to the question being answered. |
| accepted    | BOOLEAN    | Indicates if the answer was accepted.      |


# Design Decisions
    Soft Delete Users
        1. I reasoned that when a User gets deleted, the content that they generated for the site will still be useful. 
           Instead of an 'on delete cascade' where I would have deleted child table records belonging to a parent table record, 
           I decided to soft delete. This has implications in that all queries must now specify that the model query must add a
           'where users.archivedAt = null' at the parent level. 

        2. I decided that even if a child record's user were archived, the content should still be useful. 
           This means that the frontend should handle the display of the 'deleted' user by detecting if there's an 'archivedAt'
           datetime returned as part of the user properties. For instance, user A created a question. User B created an answer 
           to user A's question. User B was deleted. If viewing all questions, question created by user A would be displayed,
           and on it user B's answer would remain attached, but user B's display name would NOT show the name on the frontend,
           but 'deleted user' by virtue of detecting if user B's archivedAt property was present.

    Colocate related files (repository next to route files)
        Projects get complicated quickly. To make it easier to dive into this codebase and navigate files quickly I decided
        to colocate repository files next to my routing files. For example, the _commentRepository file is within the
         /pages/api/comments folder and alongside /pages/api/comments/index.ts and /pages/api/comments/[id].ts.
    Break out queries into respository files
        I reasoned that a query spanning multiple tables could be considered a model OR a respository. I decided to create the
        repository file, and I will reserve the model file for model validations for a later date when I really need that type of file.
    Index appropriately
    Validate inputs on ingress
    Appropriate http errors and responses













