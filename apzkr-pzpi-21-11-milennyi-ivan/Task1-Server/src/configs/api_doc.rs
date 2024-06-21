use utoipa::OpenApi;
use crate::models::*;
use crate::view_models::*;
use crate::view_models::extra_view_models::*;
use crate::json_structs::*;
use crate::endpoints::*;

#[derive(OpenApi)]
#[openapi(
     // Paths corresponding to various service methods across different modules are included here
    paths(
        breed_endpoints::breed_get_all,
        breed_endpoints::breed_get_by_id,
        breed_endpoints::breed_get_all_vms,
        breed_endpoints::breed_create,
        breed_endpoints::breed_update,
        breed_endpoints::breed_delete,
        feed_endpoints::feed_get_all,
        feed_endpoints::feed_get_by_id,
        feed_endpoints::feed_get_all_vms,
        feed_endpoints::feed_create,
        feed_endpoints::feed_update,
        feed_endpoints::feed_delete,
        feed_supply_endpoints::feed_supply_get_all,
        feed_supply_endpoints::feed_supply_get_by_id,
        feed_supply_endpoints::feed_supply_get_all_vms_by_feed_id,
        feed_supply_endpoints::feed_supply_get_all_vms,
        feed_supply_endpoints::feed_supply_create,
        feed_supply_endpoints::feed_supply_delete,
        feeding_log_endpoints::feeding_log_create,
        feeding_log_endpoints::feeding_log_delete,
        feeding_log_endpoints::feeding_log_get_all,
        feeding_log_endpoints::feeding_log_get_by_id,
        feeding_log_endpoints::feeding_log_get_all_vms_by_sheep_id,
        feeding_log_endpoints::feeding_log_get_all_vms_by_feed_id,
        shearing_log_endpoints::shearing_log_create,
        shearing_log_endpoints::shearing_log_delete,
        shearing_log_endpoints::shearing_log_get_all,
        shearing_log_endpoints::shearing_log_get_by_id,
        shearing_log_endpoints::shearing_log_get_all_vms_by_sheep_id,
        sheep_endpoints::sheep_get_all,
        sheep_endpoints::sheep_get_by_id,
        sheep_endpoints:: sheep_get_details_by_id,
        sheep_endpoints::sheep_get_all_vms_by_shepherd_id,
        sheep_endpoints::sheep_create,
        sheep_endpoints::sheep_update,
        sheep_endpoints::sheep_change_temperature_scanner,
        sheep_endpoints::sheep_change_shepherd,
        sheep_endpoints::sheep_delete,
        shepherd_endpoints::shepherd_create,
        shepherd_endpoints::shepherd_update,
        shepherd_endpoints::shepherd_delete,
        shepherd_endpoints::shepherd_authorize,
        shepherd_endpoints::shepherd_get_all,
        shepherd_endpoints::shepherd_get_by_id,
        shepherd_endpoints::shepherd_get_all_vms,
        storekeeper_endpoints::storekeeper_create,
        storekeeper_endpoints::storekeeper_update,
        storekeeper_endpoints::storekeeper_delete,
        storekeeper_endpoints::storekeeper_authorize,
        storekeeper_endpoints::storekeeper_get_all,
        storekeeper_endpoints::storekeeper_get_by_id,
        temperature_scanner_endpoints::temperature_scanner_get_all,
        temperature_scanner_endpoints::temperature_scanner_get_all_unassigned_scanners_ids,
        temperature_scanner_endpoints::temperature_scanner_get_by_id,
        temperature_scanner_endpoints::temperature_scanner_authenticate,
        temperature_scanner_endpoints::temperature_scanner_create,
        temperature_scanner_endpoints::temperature_scanner_update,
        temperature_scanner_endpoints::temperature_scanner_update_temperature,
        temperature_scanner_endpoints::temperature_scanner_delete,
    ),
     // Components such as schemas used in API documentation are defined here
    components(
        schemas(
            Breed, Feed, FeedSupply, FeedingLog, ShearingLog, Sheep, Shepherd, Storekeeper, TemperatureScanner,
            BreedVM, FeedVM, FeedSupplyVM, FeedingLogVM, ShearingLogVM, SheepVM, ShepherdVM, StorekeeperVM, TemperatureScannerVM,
            SheepDetailsVM,
            ChangeIdJson, AuthorizeJson, TemperatureScannerAuthJson, TemperatureScannerTempJson,
            PathId
        )
    ),
    // Tags for grouping API endpoints are defined here
    tags(
        (name = "Server", description = "API view")
    )
)]
pub(super) struct ApiDoc;