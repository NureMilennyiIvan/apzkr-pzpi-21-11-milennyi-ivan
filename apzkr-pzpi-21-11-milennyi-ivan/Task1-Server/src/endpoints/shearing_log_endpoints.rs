use std::sync::Arc;
use actix_web::{delete, get, post, Responder};
use actix_web::web::{Data, Json, Path};
use sqlx::{MySql, Pool};
use crate::db::services::ShearingLogService;
use crate::db::traits::{Service, ShearingLogManage};
use crate::endpoints::utils::{send_service_message, send_service_result, validate_json_body};
use crate::json_structs::PathId;
use crate::models::ShearingLog;

#[utoipa::path(responses(
    (status = 200, description = "Shearing log get all"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх логів стрижки
#[get("/shearing-log")]
async fn shearing_log_get_all(shearing_log_service: Data<Arc<ShearingLogService<Pool<MySql>>>>) -> impl Responder {
    let result = shearing_log_service.get_all().await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Shearing log get by id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання логу стрижки за ідентифікатором
#[get("/shearing-log/{id}")]
async fn shearing_log_get_by_id(shearing_log_service: Data<Arc<ShearingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = shearing_log_service.get_by_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Shearing log all vms by sheep id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх ViewModel логів стрижки за ідентифікатором вівці
#[get("/shearing-log/sheep/{id}")]
async fn shearing_log_get_all_vms_by_sheep_id(shearing_log_service: Data<Arc<ShearingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = shearing_log_service.get_all_vms_by_sheep_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Shearing log created"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для створення нового логу стрижки
#[post("/shearing-log/create")]
async fn shearing_log_create(shearing_log_service: Data<Arc<ShearingLogService<Pool<MySql>>>>, shearing_log_json: Json<ShearingLog>) -> impl Responder {
    let shearing_log = match validate_json_body(shearing_log_json) {
        Ok(shearing_log) => shearing_log,
        Err(error_response) => return error_response,
    };
    let result = shearing_log_service.create(shearing_log).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Shearing log deleted"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для видалення логу стрижки за ідентифікатором
#[delete("/shearing-log/delete/{id}")]
async fn shearing_log_delete(shearing_log_service: Data<Arc<ShearingLogService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    send_service_message(shearing_log_service.delete(params.id).await, "Deleted")
}
