use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє вівцю
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct Sheep {
    id: Option<u64>, // Ідентифікатор вівці
    birth_date: u64, // Дата народження (у вигляді таймстемпу)
    breed_id: u64, // Ідентифікатор породи
    weight: u64, // Вага
    sex: bool, // Стать
    temperature_scanner_id: Option<u64>, // Ідентифікатор сканера температури
    shepherd_id: Option<u64> // Ідентифікатор пастуха
}

impl Sheep {
    // Отримання ідентифікатора вівці
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора вівці
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання дати народження
    pub fn birth_date(&self) -> u64 {
        self.birth_date
    }

    // Отримання ідентифікатора породи
    pub fn breed_id(&self) -> u64 {
        self.breed_id
    }

    // Отримання ваги
    pub fn weight(&self) -> u64 {
        self.weight
    }

    // Отримання статі
    pub fn sex(&self) -> bool {
        self.sex
    }

    // Отримання ідентифікатора сканера температури
    pub fn temperature_scanner_id(&self) -> Option<u64> {
        self.temperature_scanner_id
    }

    // Отримання ідентифікатора пастуха
    pub fn shepherd_id(&self) -> Option<u64> {
        self.shepherd_id
    }
}
