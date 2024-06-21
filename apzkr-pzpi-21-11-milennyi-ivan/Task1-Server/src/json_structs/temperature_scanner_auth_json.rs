use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє дані для автентифікації сканера температури (JSON)
#[derive(Deserialize, ToSchema, Debug, Validate)]
pub(crate) struct TemperatureScannerAuthJson {
    #[validate(length(min = 1))]
    pub password: String // Пароль для автентифікації
}
