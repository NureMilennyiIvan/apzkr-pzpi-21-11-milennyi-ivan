use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє постачання корму
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct FeedSupply {
    id: Option<u64>, // Ідентифікатор постачання корму
    storekeeper_id: Option<u64>, // Ідентифікатор комірника
    #[validate(range(min = 1))]
    amount: u64, // Кількість корму
    timestamp: u64, // Час постачання (у вигляді таймстемпу)
    feed_id: u64 // Ідентифікатор корму
}

impl FeedSupply {
    // Отримання ідентифікатора постачання
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора постачання
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання ідентифікатора комірника
    pub fn storekeeper_id(&self) -> Option<u64> {
        self.storekeeper_id
    }

    // Отримання кількості корму
    pub fn amount(&self) -> u64 {
        self.amount
    }

    // Отримання часу постачання
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }

    // Отримання ідентифікатора корму
    pub fn feed_id(&self) -> u64 {
        self.feed_id
    }
}
