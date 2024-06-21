use std::sync::Arc;
use actix_web::{delete, get, post, Responder};
use actix_web::web::{Data, Json, Path};
use sqlx::{MySql, Pool};
use crate::db::services::FeedingLogService;
use crate::db::traits::{FeedingLogManage, Service};
use crate::endpoints::utils::{send_service_message, send_service_result, validate_json_body};
use crate::json_structs::PathId;
use crate::models::FeedingLog;

#[utoipa::path(responses(
    (status = 200, description = "Feeding log get all"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх логів годування
#[get("/feeding-log")]
async fn feeding_log_get_all(feeding_log_service: Data<Arc<FeedingLogService<Pool<MySql>>>>) -> impl Responder {
    let result = feeding_log_service.get_all().await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feeding log get by id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання логу годування за ідентифікатором
#[get("/feeding-log/{id}")]
async fn feeding_log_get_by_id(feeding_log_service: Data<Arc<FeedingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = feeding_log_service.get_by_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feeding log all vms by sheep id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх ViewModel логів годування за ідентифікатором вівці
#[get("/feeding-log/sheep/{id}")]
async fn feeding_log_get_all_vms_by_sheep_id(feeding_log_service: Data<Arc<FeedingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = feeding_log_service.get_all_vms_by_sheep_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feeding log all vms by feed id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх ViewModel логів годування за ідентифікатором корму
#[get("/feeding-log/feed/{id}")]
async fn feeding_log_get_all_vms_by_feed_id(feeding_log_service: Data<Arc<FeedingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = feeding_log_service.get_all_vms_by_feed_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Feeding log created"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для створення нового логу годування
#[post("/feeding-log/create")]
async fn feeding_log_create(feeding_log_service: Data<Arc<FeedingLogService<Pool<MySql>>>>, feeding_log_json: Json<FeedingLog>) -> impl Responder {
    let feeding_log = match validate_json_body(feeding_log_json) {
        Ok(feeding_log) => feeding_log,
        Err(error_response) => return error_response,
    };
    let result = feeding_log_service.create(feeding_log).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feeding log deleted"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для видалення логу годування за ідентифікатором
#[delete("/feeding-log/delete/{id}")]
async fn feeding_log_delete(feeding_log_service: Data<Arc<FeedingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    send_service_message(feeding_log_service.delete(params.id).await, "Deleted")
}
