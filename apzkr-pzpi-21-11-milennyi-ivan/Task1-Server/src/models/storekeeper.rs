use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє комірника
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct Storekeeper {
    id: Option<u64>, // Ідентифікатор комірника
    #[validate(length(min = 1))]
    username: String, // Логін комірника
    #[validate(length(min = 1))]
    password: String, // Пароль комірника
    #[validate(length(min = 1))]
    name: String, // Ім'я комірника
    #[validate(length(min = 1))]
    surname: String, // Прізвище комірника
}

impl Storekeeper {
    // Отримання ідентифікатора комірника
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора комірника
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання логіна комірника
    pub fn username(&self) -> &str {
        &self.username
    }

    // Отримання пароля комірника
    pub fn password(&self) -> &str {
        &self.password
    }

    // Отримання імені комірника
    pub fn name(&self) -> &str {
        &self.name
    }

    // Отримання прізвища комірника
    pub fn surname(&self) -> &str {
        &self.surname
    }
}
