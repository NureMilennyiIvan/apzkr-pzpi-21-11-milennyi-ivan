use std::{env, io, net::Ipv4Addr, sync::Arc};
use actix_cors::Cors;
use actix_web::{App, HttpServer, main, http::header, middleware::Logger, web::Data};
use dotenv::dotenv;
use log::info;
use sqlx::{MySql, Pool};

use crate::configs::{logger_wrapper::LoggerWrapper, breed_configure, feed_configure, feed_supply_configure, feeding_log_configure, shearing_log_configure, sheep_configure, shepherd_configure, storekeeper_configure, temperature_scanner_configure};
use crate::configs::swagger_ui_wrapper::SwaggerUiWrapper;
use crate::db::services::{BreedService, FeedingLogService, FeedService, FeedSupplyService, ShearingLogService, SheepService, ShepherdService, StorekeeperService, TemperatureScannerService};
use crate::db::db_context::DbContextMySql;
use crate::db::traits::{Context, Service};

mod configs;
mod db;
mod models;
mod view_models;
mod endpoints;
mod json_structs;

#[main]
async fn main() -> io::Result<()>{
    // Завантаження змінних середовища
    dotenv().ok();

    // Отримання IP-адреси додатку зі змінної середовища
    let app_ip_bytes: Vec<u8> = env::var("APP_IP").unwrap_or_else(|_| "".to_string())
        .split('.')
        .map(|byte| byte.parse::<u8>().expect("Invalid number in APP_IP"))
        .collect();
    let app_ip: Ipv4Addr = Ipv4Addr::new(app_ip_bytes[0], app_ip_bytes[1], app_ip_bytes[2], app_ip_bytes[3]);

    // Отримання порту додатку зі змінної середовища
    let app_port: u16 = env::var("APP_PORT").unwrap_or_else(|_| "".to_string())
        .parse().expect("Invalid app port number");

    // Отримання рядка підключення до бази даних зі змінної середовища
    let db_string = env::var("DATABASE_URL").unwrap_or_else(|_| "".to_string());

    // Створення контексту бази даних
    let db_context: DbContextMySql<Pool<MySql>> = DbContextMySql::new(db_string).await;

    // Створення сервісів
    let breed_service: Arc<BreedService<Pool<MySql>>> = Arc::new(BreedService::new(db_context.get_pool()));
    let feed_service: Arc<FeedService<Pool<MySql>>> = Arc::new(FeedService::new(db_context.get_pool()));
    let feed_supply_service: Arc<FeedSupplyService<Pool<MySql>>> = Arc::new(FeedSupplyService::new(db_context.get_pool()));
    let feeding_log_service: Arc<FeedingLogService<Pool<MySql>>> = Arc::new(FeedingLogService::new(db_context.get_pool()));
    let shearing_log_service: Arc<ShearingLogService<Pool<MySql>>> = Arc::new(ShearingLogService::new(db_context.get_pool()));
    let sheep_service: Arc<SheepService<Pool<MySql>>> = Arc::new(SheepService::new(db_context.get_pool()));
    let shepherd_service: Arc<ShepherdService<Pool<MySql>>> = Arc::new(ShepherdService::new(db_context.get_pool()));
    let storekeeper_service: Arc<StorekeeperService<Pool<MySql>>> = Arc::new(StorekeeperService::new(db_context.get_pool()));
    let temperature_service: Arc<TemperatureScannerService<Pool<MySql>>> = Arc::new(TemperatureScannerService::new(db_context.get_pool()));

    // Налаштування логування
    LoggerWrapper::default();
    info!("Server started");

    // Налаштування та запуск HTTP сервера
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(breed_service.clone()))
            .app_data(Data::new(feed_service.clone()))
            .app_data(Data::new(feed_supply_service.clone()))
            .app_data(Data::new(feeding_log_service.clone()))
            .app_data(Data::new(shearing_log_service.clone()))
            .app_data(Data::new(sheep_service.clone()))
            .app_data(Data::new(shepherd_service.clone()))
            .app_data(Data::new(storekeeper_service.clone()))
            .app_data(Data::new(temperature_service.clone()))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT, header::ACCESS_CONTROL_REQUEST_METHOD, header::ACCESS_CONTROL_REQUEST_HEADERS, header::ORIGIN, header::CONTENT_TYPE])
                    .max_age(3600)
            )
            .wrap(Logger::default())
            .configure(breed_configure)
            .configure(feed_configure)
            .configure(feed_supply_configure)
            .configure(feeding_log_configure)
            .configure(shearing_log_configure)
            .configure(sheep_configure)
            .configure(shepherd_configure)
            .configure(storekeeper_configure)
            .configure(temperature_scanner_configure)
            .service(SwaggerUiWrapper::build_swagger_ui())
    }).bind((app_ip, app_port))?.run().await
}