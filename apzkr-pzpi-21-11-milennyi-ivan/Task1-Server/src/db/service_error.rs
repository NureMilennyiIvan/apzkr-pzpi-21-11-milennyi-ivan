use std::error::Error;
use std::fmt::{Display, Formatter};

// Перелічення можливих помилок сервісу
#[derive(Debug)]
pub(crate) enum ServiceError {
    DatabaseError(sqlx::Error),                // Помилка бази даних
    ValidationError(validator::ValidationErrors), // Помилка валідації
    UniqueError,                               // Помилка унікальності
    CustomError(String),                       // Користувацька помилка
    ForbiddenError                             // Помилка забороненої дії
}

// Реалізація Display для ServiceError
impl Display for ServiceError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match &self {
            ServiceError::DatabaseError(error) => write!(formatter, "Database error: {}", error.to_string()),
            ServiceError::ValidationError(error) => write!(formatter, "Validation error: {}", error.to_string()),
            ServiceError::UniqueError => write!(formatter, "This user already exists."),
            ServiceError::CustomError(error) => write!(formatter, "Custom error: {}", error),
            ServiceError::ForbiddenError => write!(formatter, "This action is forbidden!")
        }
    }
}

// Реалізація Error для ServiceError
impl Error for ServiceError {}
