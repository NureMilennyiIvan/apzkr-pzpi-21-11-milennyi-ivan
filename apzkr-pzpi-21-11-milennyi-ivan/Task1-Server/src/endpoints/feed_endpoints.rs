use std::sync::Arc;
use actix_web::{delete, get, post, put, Responder};
use actix_web::web::{Data, Json, Path};
use sqlx::{MySql, Pool};
use crate::db::services::FeedService;
use crate::db::traits::{FeedManage, Service};
use crate::endpoints::utils::{send_service_message, send_service_result, validate_json_body};
use crate::json_structs::PathId;
use crate::models::Feed;

#[utoipa::path(responses(
    (status = 200, description = "Feed get all"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх кормів
#[get("/feed")]
async fn feed_get_all(feed_service: Data<Arc<FeedService<Pool<MySql>>>>) -> impl Responder {
    let result = feed_service.get_all().await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feed get by id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання корму за ідентифікатором
#[get("/feed/{id}")]
async fn feed_get_by_id(feed_service: Data<Arc<FeedService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = feed_service.get_by_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Feed get all vms"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх ViewModel кормів
#[get("/feed-vms")]
async fn feed_get_all_vms(feed_service: Data<Arc<FeedService<Pool<MySql>>>>) -> impl Responder {
    let result = feed_service.get_all_vms().await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Feed created"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для створення нового корму
#[post("/feed/create")]
async fn feed_create(feed_service: Data<Arc<FeedService<Pool<MySql>>>>, feed_json: Json<Feed>) -> impl Responder {
    let feed = match validate_json_body(feed_json) {
        Ok(feed) => feed,
        Err(error_response) => return error_response,
    };
    let result = feed_service.create(feed).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Feed updated"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для оновлення корму
#[put("/feed/update")]
async fn feed_update(feed_service: Data<Arc<FeedService<Pool<MySql>>>>, feed_json: Json<Feed>) -> impl Responder {
    let feed = match validate_json_body(feed_json) {
        Ok(feed) => feed,
        Err(error_response) => return error_response,
    };
    let result = feed_service.update(feed).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feed deleted"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для видалення корму за ідентифікатором
#[delete("/feed/delete/{id}")]
async fn feed_delete(feed_service: Data<Arc<FeedService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    send_service_message(feed_service.delete(params.id).await, "Deleted")
}
