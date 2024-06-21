use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє породу
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct Breed{
    id: Option<u64>, // Ідентифікатор породи
    #[validate(length(min = 1))]
    name: String, // Назва породи
    feed_id: u64, // Ідентифікатор корму, що підходить для породи
    #[validate(length(min = 1))]
    info: String // Додаткова інформація про породу
}

impl Breed {
    // Отримання ідентифікатора породи
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора породи
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання назви породи
    pub fn name(&self) -> &str {
        &self.name
    }

    // Отримання ідентифікатора корму
    pub fn feed_id(&self) -> u64 {
        self.feed_id
    }

    // Отримання додаткової інформації про породу
    pub fn info(&self) -> &str {
        &self.info
    }
}