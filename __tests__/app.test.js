const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    it("200: it responds with an array of topic objects with slug and description properties", async () => {
      const { body } = await request(app).get("/api/topics").expect(200);
      expect(body.topics.length > 0).toBe(true);
      body.topics.forEach((topic) => {
        expect(topic).toEqual(
          expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String),
          })
        );
      });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    it("200: responds with an array of all articles properties including the correct author and comment_count", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles.length).toBe(12);
      body.articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
    });
    it("200: should be sorted by date in Ascending order", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toBeSorted({
        key: "created_at",
        descending: true,
      });
    });
    it("200: responds with specified topic when query is input", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=mitch")
        .expect(200);
      expect(body.articles.length === 11).toBe(true);
      body.articles.forEach((article) => {
        expect(article.topic).toBe("mitch");
      });
    });
    it("200: topic exists but has no articles", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=paper")
        .expect(200);
      expect(body.articles).toEqual([]);
    });
    it("404: topic does not exist in articles", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=coding")
        .expect(404);
      expect(body.msg).toBe("coding not found");
    });
  });
  describe("GET /api/articles sort_by(queries)", () => {
    it("200: returns all articles sorted by valid column defaults to descending", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title")
        .expect(200);
      expect(body.articles).toBeSorted({
        key: "title",
        descending: true,
      });
    });
    it("200: returns all articles sorted by valid column and allows order to be changed to ascending", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order_by=ASC")
        .expect(200);
      expect(body.articles).toBeSorted({
        key: "title",
        ascending: true,
      });
    });
    it("200: returns all articles sorted by valid column and allows order to be changed to ascending", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order_by=ASC")
        .expect(200);
      expect(body.articles).toBeSorted({
        key: "title",
        ascending: true,
      });
    });
    it("400: cannot search by invalid column name", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=invalid")
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("400: cannot search by invalid order type", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order_by=invalid")
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("400: sends 400 error if any data added after legitimate queries (error codes added to badRequestErrors in app)", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order_by=ASC;DROP TABLE users")
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("400: query inputs are sanitised to only allow certain queries to be made)", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order_by=ASC;DROP TABLE users")
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
  });
  describe("GET api/articles/:article_id", () => {
    it("200: it responds with an article object all article properties and author", async () => {
      const { body } = await request(app).get("/api/articles/1").expect(200);
      expect(body.articles).toEqual(
        expect.objectContaining({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        })
      );
    });
    it("404: id number not found", async () => {
      const { body } = await request(app).get("/api/articles/20").expect(404);
      expect(body.msg).toBe("not found");
    });
    it("400: wrong data type in request", async () => {
      const { body } = await request(app).get("/api/articles/one").expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("200: also includes total count of all comments with this article_id (test 1)", async () => {
      const { body } = await request(app).get("/api/articles/1").expect(200);
      expect(body.articles).toEqual(
        expect.objectContaining({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        })
      );
    });
    it("200: also includes total count of all comments with this article_id (test 2)", async () => {
      const { body } = await request(app).get("/api/articles/5").expect(200);
      expect(body.articles).toEqual(
        expect.objectContaining({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          comment_count: 2,
        })
      );
    });
    it("200: also includes total count of comments when this is 0", async () => {
      const { body } = await request(app).get("/api/articles/4").expect(200);
      expect(body.articles).toEqual(
        expect.objectContaining({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          comment_count: 0,
        })
      );
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it("200: updates votes by number indicated in recieved object", async () => {
      const testVotes = { inc_votes: -50 };
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(testVotes)
        .expect(200);
      expect(body.article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 50,
      });
    });
    it("400: wrong key entered", async () => {
      const testVotes = { wrong_key: -50 };
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(testVotes)
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("400: wrong data type for votes", async () => {
      const testVotes = { inc_votes: "fifty" };
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(testVotes)
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("404: article_id not found", async () => {
      const testVotes = { inc_votes: 50 };
      const { body } = await request(app)
        .patch("/api/articles/20")
        .send(testVotes)
        .expect(404);
      expect(body.msg).toBe("not found");
    });
    it("wrong data type for article_id", async () => {
      const testVotes = { inc_votes: 50 };
      const { body } = await request(app)
        .patch("/api/articles/ten")
        .send(testVotes)
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    it("returns an array of comments for the given article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/1/comments")
        .expect(200);
      expect(body.comments.length).toBe(11);
      body.comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
    });
    it("200: returns an empty array when there are no comments relating to an active article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/2/comments")
        .expect(200);
      expect(body.comments).toEqual([]);
    });
    it("404: returns an error when an article_id that does not exist is entered", async () => {
      const { body } = await request(app)
        .get("/api/articles/20/comments")
        .expect(404);
      expect(body.msg).toEqual("article id 20 not found");
    });
    it("400: returns an error when invalid article_id is given", async () => {
      const { body } = await request(app)
        .get("/api/articles/one/comments")
        .expect(400);
      expect(body.msg).toEqual("bad request");
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    it("201: reponds with the posted comment and the correct keys", async () => {
      const testComment = {
        username: "butter_bridge",
        body: "test comment",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(201);
      expect(body.comment).toEqual({
        comment_id: 19,
        body: "test comment",
        votes: 0,
        author: "butter_bridge",
        article_id: 1,
        created_at: expect.any(String),
      });
    });
    it("400: wrong data type entered", async () => {
      const testComment = {
        username: 123,
        body: "test body",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(404);
      expect(body.msg).toBe("not found");
    });
    it("400: empty data field", async () => {
      const testComment = {
        username: "butter_bridge",
        body: "",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(404);
      expect(body.msg).toBe("not found");
    });
    it("404: username not found", async () => {
      const testComment = {
        username: "wrong_username",
        body: "test body",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(404);
      expect(body.msg).toBe("not found");
    });
    it("400: missing required field/key", async () => {
      const testComment = {
        body: "test body",
      };
      const { body } = await request(app)
        .post("/api/articles/20/comments")
        .send(testComment)
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
    it("400: article_id does not exist", async () => {
      const testComment = {
        username: "butter_bridge",
        body: "test body",
      };
      const { body } = await request(app)
        .post("/api/articles/20/comments")
        .send(testComment)
        .expect(404);
      expect(body.msg).toBe("not found");
    });
    it("400: invalid article_id", async () => {
      const testComment = {
        username: "butter_bridge",
        body: "test body",
      };
      const { body } = await request(app)
        .post("/api/articles/invalid/comments")
        .send(testComment)
        .expect(400);
      expect(body.msg).toBe("bad request");
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("200: responds with an array of users", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users.length === 4).toBe(true);
      body.users.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
    });
  });
  describe("GET api/user/:username", () => {
    it("200: responds with an object of the user with the passed username", async () => {
      const { body } = await request(app)
        .get("/api/users/butter_bridge")
        .expect(200);
      expect(body.user).toEqual({
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      });
    });
    it("404: username not found", async () => {
      const { body } = await request(app)
        .get("/api/users/wrong_username")
        .expect(404);
      expect(body.msg).toEqual("wrong_username not found");
    });
    it("400: wrong data type entered", async () => {
      const { body } = await request(app).get("/api/users/1").expect(400);
      expect(body.msg).toEqual("bad request");
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    it("204: deletes the comment with the given id", async () => {
      await request(app).delete("/api/comments/1").expect(204);
      const { rows } = await db.query(
        `SELECT * FROM comments WHERE comment_id = 1`
      );
      const allCommentIds = rows.map((row) => {
        return row.comment_id;
      });
      expect(allCommentIds).toEqual([]);
    });
    it("404: comment does not exist", async () => {
      const { body } = await request(app)
        .delete("/api/comments/20")
        .expect(404);
      expect(body.msg).toBe("not found");
    });
  });
  it("400: article_id is invalid", async () => {
    const { body } = await request(app)
      .delete("/api/comments/invalid")
      .expect(400);
    expect(body.msg).toBe("bad request");
  });
});

describe("GET /api", () => {
  it("returns the endpoints.json file", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(typeof body.endpoints).toBe("object");
  });
});
