use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє пастуха
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct Shepherd {
    id: Option<u64>, // Ідентифікатор пастуха
    #[validate(length(min = 1))]
    username: String, // Логін пастуха
    #[validate(length(min = 1))]
    password: String, // Пароль пастуха
    #[validate(length(min = 1))]
    name: String, // Ім'я пастуха
    #[validate(length(min = 1))]
    surname: String, // Прізвище пастуха
}

impl Shepherd {
    // Отримання ідентифікатора пастуха
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора пастуха
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання логіна пастуха
    pub fn username(&self) -> &str {
        &self.username
    }

    // Отримання пароля пастуха
    pub fn password(&self) -> &str {
        &self.password
    }

    // Отримання імені пастуха
    pub fn name(&self) -> &str {
        &self.name
    }

    // Отримання прізвища пастуха
    pub fn surname(&self) -> &str {
        &self.surname
    }
}
