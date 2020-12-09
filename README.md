# CPSC 471 Project

To be able to run locally, place the `.env` file in the root directory.

# API

## Users / Auth

### Get All Users

`GET http://localhost:3000/api/user`

- Requires a valid teacher auth-token
- Returns a JSON object of all users in the database

### Register User

`POST http://localhost:3000/api/user/register`

- `email` must be unique and a valid email
- `password` must be at least 6 characters
- `userType` must either be `student` or `teacher`

```json
{
	"name": {
		"firstName": "New",
		"lastName": "Teacher"
	},
	"email": "teacher@email.com",
	"password": "123456",
	"userType": "teacher"
}
```

### Login User

`POST http://localhost:3000/api/user/login`

- Returns an auth-token

```json
{
	"email": "teacher@email.com",
	"password": "123456"
}
```

### Delete A User

`DELETE http://localhost:3000/api/user/:userId`

- Requires a valid teacher auth-token
- `:userId` must be an existing user ID

### Update A User

`PATCH http://localhost:3000/api/user/:userId`

- Requires a valid teacher auth-token
- `:userId` must be an existing user ID

```json
{
	"name": {
		"firstName": "Updated",
		"lastName": "Teacher"
	},
	"email": "updatedTeacher@email.com",
	"password": "1234567",
	"userType": "teacher"
}
```

---

## Courses

### Get All Courses

`GET http://localhost:3000/api/courses`

- Requires a valid teacher auth-token
- Returns a JSON object of all courses in the database

### Get A Specific Course

`GET http://localhost:3000/api/courses/:courseId`

- Returns a JSON object of the specific course

### Get A Student's Courses

`GET http://localhost:3000/api/courses/student/:userId`

- Requires a valid student auth-token
- `:userId` must be an existing user ID
- Returns a JSON object of the specific courses

### Create A New Course

- Requires a valid teacher auth-token
- Requires for teacher to not be teaching any other courses

`POST http://localhost:3000/api/courses/create`

### Register For A Course

- Requires a valid student auth-token

`POST http://localhost:3000/api/courses/register`

### Delete A Course

`DELETE http://localhost:3000/api/courses/:courseId`

- Requires a valid teacher auth-token

### Update A Course

`PATCH http://localhost:3000/api/courses/:courseId`

- Requires a valid teacher auth-token

---

## Exams

### Get All Exams

`GET http://localhost:3000/api/exams`

- Requires a valid teacher auth-token
- Returns a JSON object of all exams in the database

### Get A Specific Exam

`GET http://localhost:3000/api/exams/:examId`

- Returns a JSON object of the specific exam

### Get A Student's Exams

`GET http://localhost:3000/api/exams/student/:userId`

- Requires a valid student auth-token
- `:userId` must be an existing user ID
- Returns a JSON object of the specific exams

### Create A New Exam

`POST http://localhost:3000/api/exam`

- Requires a valid teacher auth-token
- Requires for teacher to be teaching a course
- Also creates a corresponding event for the exam

### Delete An Exam

`DELETE http://localhost:3000/api/exams/:examId`

- Requires a valid teacher auth-token

### Update An Exam

`PATCH http://localhost:3000/api/exams/:examId`

- Requires a valid teacher auth-token

---

## Events

### Get All Events

`GET http://localhost:3000/api/events`

- Requires a valid teacher auth-token
- Returns a JSON object of all cue card collections in the database

### Get An Event

`GET http://localhost:3000/api/events/:eventId`

### Delete An Event

`DELETE http://localhost:3000/api/events/:eventId`

### Update An Event

`PATCH http://localhost:3000/api/events/:eventId`

---

## Notes

### Get All Cue Card Collections

`GET http://localhost:3000/api/notes/cuecardcollection`

- Requires a valid teacher auth-token
- Returns a JSON object of all cue card collections in the database

### Get Student's Cue Card Collections

`GET http://localhost:3000/api/notes/cuecardcollection/:userId`

- Requires a valid student auth-token
- Returns a JSON object of a student's cue card collection

### Create A New Cue Card Collection

`POST http://localhost:3000/api/notes/cuecardcollection`

```json
{
	"name": "Collection Name",
	"courseId": "5fd007e5e5ac8dcb529325f5"
}
```

### Delete A Cue Card Collection

`DELETE http://localhost:3000/api/notes/cuecardcollection/:collectionId`

### Update A Cue Card Collection

`PATCH http://localhost:3000/api/notes/cuecardcollection/:collectionId`

### Get All Cue Cards

`GET http://localhost:3000/api/notes/cuecard`

### Create A New Cue Card

`POST http://localhost:3000/api/notes/cuecard`

```json
{
	"question": "True or False?",
	"answer": "False",
	"collectionId": "5fd0174c4ea7da77d8e49abc"
}
```

### Delete A Cue Card

`DELETE http://localhost:3000/api/notes/cuecard/:cardId`

### Update A Cue Card

`PATCH http://localhost:3000/api/notes/cuecard/:cardId`

### Get All Notes

`GET http://localhost:3000/api/notes/note`

### Create A New Note

`POST http://localhost:3000/api/notes/note`

### Delete A Specific Note

`DELETE http://localhost:3000/api/notes/note/:noteId`

### Update A Note

`PATCH http://localhost:3000/api/notes/note/:noteId`



