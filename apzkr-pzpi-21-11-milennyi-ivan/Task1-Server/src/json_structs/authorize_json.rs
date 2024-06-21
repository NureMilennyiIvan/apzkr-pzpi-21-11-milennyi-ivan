use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє дані для авторизації (JSON)
#[derive(Deserialize, ToSchema, Debug, Validate)]
pub(crate) struct AuthorizeJson {
    #[validate(length(min = 1))]
    pub username: String, // Логін користувача
    #[validate(length(min = 1))]
    pub password_hash: String // Хеш пароля користувача
}
