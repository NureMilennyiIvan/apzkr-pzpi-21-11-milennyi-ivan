use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє лог годування
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct FeedingLog {
    id: Option<u64>, // Ідентифікатор логу годування
    sheep_id: u64, // Ідентифікатор вівці
    shepherd_id: Option<u64>, // Ідентифікатор пастуха
    timestamp: u64, // Час годування (у вигляді таймстемпу)
    feed_id: u64, // Ідентифікатор корму
    #[validate(range(min = 1))]
    amount: u64 // Кількість корму
}

impl FeedingLog {
    // Отримання ідентифікатора логу годування
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора логу годування
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

    // Отримання часу годування
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }

    // Отримання ідентифікатора корму
    pub fn feed_id(&self) -> u64 {
        self.feed_id
    }

    // Отримання кількості корму
    pub fn amount(&self) -> u64 {
        self.amount
    }
}
