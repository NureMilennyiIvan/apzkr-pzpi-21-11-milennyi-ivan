use std::sync::Arc;
use actix_web::{delete, get, HttpResponse, post, put, Responder};
use actix_web::web::{Data, Json, Path};
use sqlx::{MySql, Pool};
use crate::db::service_error::ServiceError;
use crate::db::services::StorekeeperService;
use crate::db::traits::{Service, AuthService};
use crate::endpoints::utils::{send_service_message, send_service_result, validate_json_body};
use crate::json_structs::{AuthorizeJson, PathId};
use crate::models::Storekeeper;

#[utoipa::path(responses(
    (status = 200, description = "Storekeeper get all"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання всіх комірників
#[get("/storekeeper")]
async fn storekeeper_get_all(storekeeper_service: Data<Arc<StorekeeperService<Pool<MySql>>>>) -> impl Responder {
    let result = storekeeper_service.get_all().await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Storekeeper get by id"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для отримання комірника за ідентифікатором
#[get("/storekeeper/{id}")]
async fn storekeeper_get_by_id(storekeeper_service: Data<Arc<StorekeeperService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    let result = storekeeper_service.get_by_id(params.id).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Storekeeper authorize"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для авторизації комірника
#[post("/storekeeper/authorize")]
async fn storekeeper_authorize(storekeeper_service: Data<Arc<StorekeeperService<Pool<MySql>>>>, authorize_json: Json<AuthorizeJson>) -> impl Responder {
    let authorize = match validate_json_body(authorize_json) {
        Ok(authorize) => authorize,
        Err(error_response) => return error_response,
    };
    let result = storekeeper_service.authorize(authorize.username, authorize.password_hash).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Storekeeper created"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для створення нового комірника
#[post("/storekeeper/create")]
async fn storekeeper_create(storekeeper_service: Data<Arc<StorekeeperService<Pool<MySql>>>>, storekeeper_json: Json<Storekeeper>) -> impl Responder {
    let storekeeper = match validate_json_body(storekeeper_json) {
        Ok(storekeeper) => storekeeper,
        Err(error_response) => return error_response,
    };
    match storekeeper_service.check_username(&storekeeper).await {
        Ok(res) => if res {
            return HttpResponse::BadRequest().json(ServiceError::UniqueError.to_string())
        },
        Err(error) => return HttpResponse::InternalServerError().json(error.to_string())
    }
    let result = storekeeper_service.create(storekeeper).await;
    send_service_result(result)
}

#[utoipa::path(responses(
    (status = 200, description = "Storekeeper updated"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для оновлення інформації про комірника
#[put("/storekeeper/update")]
async fn storekeeper_update(storekeeper_service: Data<Arc<StorekeeperService<Pool<MySql>>>>, storekeeper_json: Json<Storekeeper>) -> impl Responder {
    let storekeeper = match validate_json_body(storekeeper_json) {
        Ok(storekeeper) => storekeeper,
        Err(error_response) => return error_response,
    };
    let result = storekeeper_service.update(storekeeper).await;
    send_service_result(result)
}

#[utoipa::path(params(PathId), responses(
    (status = 200, description = "Storekeeper deleted"),
    (status = 400, description = "Validation error or bad request"),
    (status = 500, description = "Internal server error")
))]
// Ендпойнт для видалення комірника за ідентифікатором
#[delete("/storekeeper/delete/{id}")]
async fn storekeeper_delete(storekeeper_service: Data<Arc<StorekeeperService<Pool<MySql>>>>, params_url: Path<PathId>) -> impl Responder {
    let params = params_url.into_inner();
    send_service_message(storekeeper_service.delete(params.id).await, "Deleted")
}
