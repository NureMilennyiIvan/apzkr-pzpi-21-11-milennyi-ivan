use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення постачання корму (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct FeedSupplyVM {
    id: u64, // Ідентифікатор постачання корму
    amount: u64, // Кількість корму
    timestamp: u64, // Час постачання (у вигляді таймстемпу)
    storekeeper_name: Option<String>, // Ім'я комірника (може бути відсутнім)
    storekeeper_surname: Option<String>, // Прізвище комірника (може бути відсутнім)
}