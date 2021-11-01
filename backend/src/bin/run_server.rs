use actix_web::{
    get, http::ContentEncoding, middleware, web, App, HttpResponse, HttpServer, Responder,
};
use anyhow::Result;
use atcoder_brainfuck_backend::database::Database;
use dotenv::dotenv;

#[get("/recent_submissions")]
async fn recent_submissions(db: web::Data<Database>) -> impl Responder {
    let result = db.get_recent_submissions(1000).await;
    match result {
        Ok(submissions) => HttpResponse::Ok().json(submissions),
        Err(_err) => HttpResponse::InternalServerError()
            .body("Error trying to read submissions from database"),
    }
}

#[actix_web::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set");

    let db = Database::connect(&database_url).await?;

    HttpServer::new(move || {
        App::new()
            .data(db.clone())
            .wrap(middleware::Compress::new(ContentEncoding::Gzip))
            .service(web::scope("/api/v1").service(recent_submissions))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await?;

    Ok(())
}
