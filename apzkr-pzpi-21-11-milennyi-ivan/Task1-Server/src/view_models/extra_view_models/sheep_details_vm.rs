use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє детальне представлення вівці (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct SheepDetailsVM {
    id: u64, // Ідентифікатор вівці
    breed: String, // Порода вівці
    breed_info: String, // Інформація про породу
    sex: bool, // Стать вівці
    birth_date: u64, // Дата народження (у вигляді таймстемпу)
    last_feeding_timestamp: Option<u64>, // Час останнього годування (може бути відсутнім)
    last_shearing_timestamp: Option<u64>, // Час останньої стрижки (може бути відсутнім)
    weight: u64, // Вага вівці
    temperature: Option<u64>, // Температура вівці (може бути відсутньою)
    feed_id: u64, // Ідентифікатор корму
    feed_name: String, // Назва корму
    required_feed_amount: u64, // Потрібна кількість корму
    available_feed_amount: u64, // Доступна кількість корму
}
