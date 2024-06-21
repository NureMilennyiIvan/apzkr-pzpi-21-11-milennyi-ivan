use serde::Deserialize;
use utoipa::ToSchema;

// Структура, що представляє зміну ідентифікатора (JSON)
#[derive(Deserialize, ToSchema, Debug)]
pub(crate) struct ChangeIdJson {
    pub change_id: Option<u64> // Новий ідентифікатор (може бути відсутнім)
}
