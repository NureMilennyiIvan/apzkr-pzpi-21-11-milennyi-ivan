use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення логу стрижки (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct ShearingLogVM {
    id: u64, // Ідентифікатор логу стрижки
    timestamp: u64, // Час стрижки (у вигляді таймстемпу)
    wool_amount: u64, // Кількість вовни
    shepherd_name: Option<String>, // Ім'я пастуха (може бути відсутнім)
    shepherd_surname: Option<String>, // Прізвище пастуха (може бути відсутнім)
    sheep_id: u64 // Ідентифікатор вівці
}
