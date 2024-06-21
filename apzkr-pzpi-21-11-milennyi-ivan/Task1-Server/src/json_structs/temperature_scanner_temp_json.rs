use serde::Deserialize;
use utoipa::ToSchema;

// Структура, що представляє дані температури сканера (JSON)
#[derive(Deserialize, ToSchema, Debug)]
pub(crate) struct TemperatureScannerTempJson {
    pub temperature: u64 // Температура, що вимірюється сканером
}
