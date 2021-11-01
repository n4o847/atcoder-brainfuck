use crate::models::{Submission, UserProblemCount};
use actix_web::client::Client;
use anyhow::{anyhow, Result};
use serde::de::DeserializeOwned;

pub struct AtCoderProblemsClient {
    client: Client,
}

impl AtCoderProblemsClient {
    pub fn new() -> Self {
        Self {
            client: Client::default(),
        }
    }

    async fn get_json<T: DeserializeOwned>(&self, url: &str) -> Result<T> {
        self.client
            .get(url)
            .header("Accept", "application/json")
            .header("Accept-Encoding", "gzip")
            .send()
            .await
            .map_err(|e| anyhow!("{}", e))?
            .json::<T>()
            .limit(1024 * 1024)
            .await
            .map_err(|e| anyhow!("{}", e))
    }

    pub async fn fetch_language_ranking(
        &self,
        from: u32,
        to: u32,
        language: &str,
    ) -> Result<Vec<UserProblemCount>> {
        let url = format!(
            "https://kenkoooo.com/atcoder/atcoder-api/v3/language_ranking?from={}&to={}&language={}",
            from, to, language
        );
        let response = self.get_json(&url).await?;
        Ok(response)
    }

    pub async fn fetch_user_submissions(
        &self,
        user: &str,
        from_second: u64,
    ) -> Result<Vec<Submission>> {
        let url = format!(
            "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user={}&from_second={}",
            user, from_second
        );
        let response = self.get_json(&url).await?;
        Ok(response)
    }
}
