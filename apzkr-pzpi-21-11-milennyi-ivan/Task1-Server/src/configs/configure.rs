use actix_web::web::ServiceConfig;
use crate::endpoints::*;

// Конфігурація сервісів для порід
pub(crate) fn breed_configure(cfg: &mut ServiceConfig){
    use breed_endpoints::*;

    cfg.service(breed_create)
        .service(breed_delete)
        .service(breed_update)
        .service(breed_get_all)
        .service(breed_get_all_vms)
        .service(breed_get_by_id);
}

// Конфігурація сервісів для кормів
pub(crate) fn feed_configure(cfg: &mut ServiceConfig){
    use feed_endpoints::*;

    cfg.service(feed_create)
        .service(feed_delete)
        .service(feed_update)
        .service(feed_get_all)
        .service(feed_get_all_vms)
        .service(feed_get_by_id);
}

// Конфігурація сервісів для постачання кормів
pub(crate) fn feed_supply_configure(cfg: &mut ServiceConfig){
    use feed_supply_endpoints::*;

    cfg.service(feed_supply_create)
        .service(feed_supply_delete)
        .service(feed_supply_get_all)
        .service(feed_supply_get_all_vms)
        .service(feed_supply_get_all_vms_by_feed_id)
        .service(feed_supply_get_by_id);
}

// Конфігурація сервісів для логів годування
pub(crate) fn feeding_log_configure(cfg: &mut ServiceConfig){
    use feeding_log_endpoints::*;

    cfg.service(feeding_log_create)
        .service(feeding_log_delete)
        .service(feeding_log_get_all)
        .service(feeding_log_get_by_id)
        .service(feeding_log_get_all_vms_by_feed_id)
        .service(feeding_log_get_all_vms_by_sheep_id);
}

// Конфігурація сервісів для логів стрижки
pub(crate) fn shearing_log_configure(cfg: &mut ServiceConfig){
    use shearing_log_endpoints::*;

    cfg.service(shearing_log_create)
        .service(shearing_log_delete)
        .service(shearing_log_get_all)
        .service(shearing_log_get_by_id)
        .service(shearing_log_get_all_vms_by_sheep_id);
}

// Конфігурація сервісів для овець
pub(crate) fn sheep_configure(cfg: &mut ServiceConfig) {
    use sheep_endpoints::*;

    cfg.service(sheep_create)
        .service(sheep_delete)
        .service(sheep_update)
        .service(sheep_change_temperature_scanner)
        .service(sheep_change_shepherd)
        .service(sheep_get_all)
        .service(sheep_get_all_vms_by_shepherd_id)
        .service(sheep_get_by_id)
        .service(sheep_get_details_by_id);
}

// Конфігурація сервісів для пастухів
pub(crate) fn shepherd_configure(cfg: &mut ServiceConfig) {
    use shepherd_endpoints::*;

    cfg.service(shepherd_create)
        .service(shepherd_delete)
        .service(shepherd_update)
        .service(shepherd_authorize)
        .service(shepherd_get_all)
        .service(shepherd_get_by_id)
        .service(shepherd_get_all_vms);
}

// Конфігурація сервісів для комірників
pub(crate) fn storekeeper_configure(cfg: &mut ServiceConfig) {
    use storekeeper_endpoints::*;

    cfg.service(storekeeper_create)
        .service(storekeeper_delete)
        .service(storekeeper_update)
        .service(storekeeper_authorize)
        .service(storekeeper_get_all)
        .service(storekeeper_get_by_id);
}

// Конфігурація сервісів для сканерів температури
pub(crate) fn temperature_scanner_configure(cfg: &mut ServiceConfig) {
    use temperature_scanner_endpoints::*;

    cfg.service(temperature_scanner_create)
        .service(temperature_scanner_delete)
        .service(temperature_scanner_update)
        .service(temperature_scanner_update_temperature)
        .service(temperature_scanner_authenticate)
        .service(temperature_scanner_get_all)
        .service(temperature_scanner_get_by_id)
        .service(temperature_scanner_get_all_unassigned_scanners_ids);
}
