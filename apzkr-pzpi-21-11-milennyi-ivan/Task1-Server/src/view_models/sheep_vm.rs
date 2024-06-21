use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення вівці (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct SheepVM {
    id: u64, // Ідентифікатор вівці
    breed: String, // Порода вівці
    sex: bool, // Стать вівці
    birth_date: u64, // Дата народження (у вигляді таймстемпу)
    last_feeding_timestamp: Option<u64>, // Час останнього годування (може бути відсутнім)
    last_shearing_timestamp: Option<u64>, // Час останньої стрижки (може бути відсутнім)
}
