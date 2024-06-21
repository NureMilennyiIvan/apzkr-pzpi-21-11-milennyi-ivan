use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє журнал стрижки
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct ShearingLog {
    id: Option<u64>, // Ідентифікатор логу стрижки
    sheep_id: u64, // Ідентифікатор вівці
    shepherd_id: Option<u64>, // Ідентифікатор пастуха
    timestamp: u64, // Час стрижки (у вигляді таймстемпу)
    #[validate(range(min = 1))]
    wool_amount: u32 // Кількість вовни
}

impl ShearingLog {
    // Отримання ідентифікатора логу стрижки
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора логу стрижки
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання ідентифікатора вівці
    pub fn sheep_id(&self) -> u64 {
        self.sheep_id
    }

    // Отримання ідентифікатора пастуха
    pub fn shepherd_id(&self) -> Option<u64> {
        self.shepherd_id
    }

    // Отримання часу стрижки
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }

    // Отримання кількості вовни
    pub fn wool_amount(&self) -> u32 {
        self.wool_amount
    }
}
