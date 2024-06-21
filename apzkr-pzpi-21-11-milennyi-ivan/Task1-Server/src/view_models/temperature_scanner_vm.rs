use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення сканера температури (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct TemperatureScannerVM {

}
