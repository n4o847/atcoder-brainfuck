DROP TABLE IF EXISTS submissions;
CREATE TABLE submissions (
  id              BIGINT NOT NULL,
  epoch_second    BIGINT NOT NULL,
  problem_id      VARCHAR(255) NOT NULL,
  contest_id      VARCHAR(255) NOT NULL,
  user_id         VARCHAR(255) NOT NULL,
  language        VARCHAR(255) NOT NULL,
  point           DOUBLE PRECISION NOT NULL,
  length          INT NOT NULL,
  result          VARCHAR(255) NOT NULL,
  execution_time  INT,
  PRIMARY KEY (id)
);
CREATE INDEX ON submissions (user_id);
CREATE INDEX ON submissions (LOWER(user_id));
CREATE INDEX ON submissions (epoch_second);
CREATE INDEX ON submissions (user_id, epoch_second ASC);
CREATE INDEX ON submissions (LOWER(user_id), epoch_second ASC);
