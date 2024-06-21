use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє сканер температури
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct TemperatureScanner {
    id: Option<u64>, // Ідентифікатор сканера температури
    temperature: u16, // Температура, що вимірюється сканером
    #[validate(length(min = 1))]
    password: String // Пароль для доступу до сканера
}

impl TemperatureScanner {
    // Отримання ідентифікатора сканера
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора сканера
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання температури
    pub fn temperature(&self) -> u16 {
        self.temperature
    }

    // Отримання пароля
    pub fn password(&self) -> &str {
        &self.password
    }
}
