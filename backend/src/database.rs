use crate::models::Submission;
use anyhow::Result;
use sqlx::postgres::PgPool;

#[derive(Clone)]
pub struct Database {
    pool: PgPool,
}

impl Database {
    pub async fn connect(uri: &str) -> Result<Self> {
        Ok(Self {
            pool: PgPool::connect(uri).await?,
        })
    }

    pub async fn update_submissions(&self, submissions: &Vec<Submission>) -> Result<()> {
        macro_rules! pluck {
            ($s:expr, $p:ident) => {
                $s.iter().map(|s| s.$p).collect::<Vec<_>>()
            };
        }

        macro_rules! pluck_as_str {
            ($s:expr, $p:ident) => {
                $s.iter().map(|s| s.$p.as_str()).collect::<Vec<_>>()
            };
        }

        sqlx::query(
            r"
            INSERT INTO submissions (
                id,
                epoch_second,
                problem_id,
                contest_id,
                user_id,
                language,
                point,
                length,
                result,
                execution_time
            )
            VALUES (
                UNNEST($1::BIGINT[]),
                UNNEST($2::BIGINT[]),
                UNNEST($3::VARCHAR(255)[]),
                UNNEST($4::VARCHAR(255)[]),
                UNNEST($5::VARCHAR(255)[]),
                UNNEST($6::VARCHAR(255)[]),
                UNNEST($7::FLOAT8[]),
                UNNEST($8::INTEGER[]),
                UNNEST($9::VARCHAR(255)[]),
                UNNEST($10::INTEGER[])
            )
            ON CONFLICT (id)
            DO UPDATE SET
                user_id = EXCLUDED.user_id,
                result = EXCLUDED.result,
                point = EXCLUDED.point,
                execution_time = EXCLUDED.execution_time
            ",
        )
        .bind(pluck!(submissions, id))
        .bind(pluck!(submissions, epoch_second))
        .bind(pluck_as_str!(submissions, problem_id))
        .bind(pluck_as_str!(submissions, contest_id))
        .bind(pluck_as_str!(submissions, user_id))
        .bind(pluck_as_str!(submissions, language))
        .bind(pluck!(submissions, point))
        .bind(pluck!(submissions, length))
        .bind(pluck_as_str!(submissions, result))
        .bind(pluck!(submissions, execution_time))
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn get_recent_submissions(&self, limit: usize) -> Result<Vec<Submission>> {
        let submissions = sqlx::query_as(
            r"
            SELECT * FROM submissions
            ORDER BY id DESC
            LIMIT $1
            ",
        )
        .bind(limit as i32)
        .fetch_all(&self.pool)
        .await?;
        Ok(submissions)
    }
}
