use std::sync::Arc;
use actix_web::{delete, get, post, Responder};
use actix_web::web::{Data, Json, Path};
use sqlx::{MySql, Pool};
use crate::db::services::FeedSupplyService;
use crate::db::traits::{FeedSupplyManage, Service};
use crate::endpoints::utils::{send_service_message, send_service_result, validate_json_body};
use crate::json_structs::PathId;
use crate::models::FeedSupply;

#[utoipa::path(responses(
    (status = 200, description = "Feed supply get all"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх постачань кормів
#[get("/feed-supply")]
async fn feed_supply_get_all(feed_supply_service: Data<Arc<FeedSupplyService<Pool<MySql>>>>) -> impl Responder {
    let result = feed_supply_service.get_all().await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feed supply get by id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання постачання корму за ідентифікатором
#[get("/feed-supply/{id}")]
async fn feed_supply_get_by_id(feed_supply_service: Data<Arc<FeedSupplyService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = feed_supply_service.get_by_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Feed supply get all vms"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх ViewModel постачань кормів
#[get("/feed-supply-vms")]
async fn feed_supply_get_all_vms(feed_supply_service: Data<Arc<FeedSupplyService<Pool<MySql>>>>) -> impl Responder {
    let result = feed_supply_service.get_all_vms().await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feed supplies all vms by feed id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх ViewModel постачань кормів за ідентифікатором корму
#[get("/feed-supply/feed/{id}")]
async fn feed_supply_get_all_vms_by_feed_id(feed_supply_service: Data<Arc<FeedSupplyService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = feed_supply_service.get_all_vms_by_feed_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Feed supply created"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для створення нового постачання корму
#[post("/feed-supply/create")]
async fn feed_supply_create(feed_supply_service: Data<Arc<FeedSupplyService<Pool<MySql>>>>, feed_supply_json: Json<FeedSupply>) -> impl Responder {
    let feed_supply = match validate_json_body(feed_supply_json) {
        Ok(feed_supply) => feed_supply,
        Err(error_response) => return error_response,
    };
    let result = feed_supply_service.create(feed_supply).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Feed supply deleted"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для видалення постачання корму за ідентифікатором
#[delete("/feed-supply/delete/{id}")]
async fn feed_supply_delete(feed_supply_service: Data<Arc<FeedSupplyService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    send_service_message(feed_supply_service.delete(params.id).await, "Deleted")
}
