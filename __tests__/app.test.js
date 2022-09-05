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
    it("200: it responds with an array of topic objects with slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
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
});

describe("/api/articles", () => {
  describe("GET api/articles/:article_id", () => {
    it("200: it responds with an article object all article properties and author", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "jonny",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
            })
          );
        });
    });
    it("404: id number not found", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    it("400: wrong data type in request", () => {
      return request(app)
        .get("/api/articles/one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("200: also includes total count of all comments with this article_id (test 1)", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "jonny",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: 11,
            })
          );
        });
    });
    it("200: also includes total count of all comments with this article_id (test 2)", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual(
            expect.objectContaining({
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "paul",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              comment_count: 2,
            })
          );
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it("200: updates votes by number indicated in recieved object", () => {
      const testVotes = { inc_votes: -50 };
      return request(app)
        .patch("/api/articles/1")
        .send(testVotes)
        .expect(200)
        .then(({ body }) => {
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
    });
    it("400: wrong key entered", () => {
      const testVotes = { wrong_key: -50 };
      return request(app)
        .patch("/api/articles/1")
        .send(testVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: wrong data type for votes", () => {
      const testVotes = { inc_votes: "fifty" };
      return request(app)
        .patch("/api/articles/1")
        .send(testVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: article_id not found", () => {
      const testVotes = { inc_votes: 50 };
      return request(app)
        .patch("/api/articles/20")
        .send(testVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    it("wrong data type for article_id", () => {
      const testVotes = { inc_votes: 50 };
      return request(app)
        .patch("/api/articles/ten")
        .send(testVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("responds with an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
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
  });
});
