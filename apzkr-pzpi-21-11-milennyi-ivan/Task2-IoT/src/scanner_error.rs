use std::error::Error;
use std::fmt::{Display, Formatter};

// Перерахування можливих помилок сканера
#[derive(Debug)]
pub(crate) enum ScannerError {
    ArgumentsError(String),          // Помилка аргументів
    UpdatingError(String),           // Помилка оновлення температури
    AuthenticationError(String)      // Помилка аутентифікації
}

// Реалізація Display для ScannerError
impl Display for ScannerError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match &self {
            // Форматування помилки аргументів
            ScannerError::ArgumentsError(error) => write!(formatter, "Arguments error: {}.\nPlease restart device and try again", error),
            // Форматування помилки оновлення температури
            ScannerError::UpdatingError(error) => write!(formatter, "Updating temperature error: {}", error),
            // Форматування помилки аутентифікації
            ScannerError::AuthenticationError(error) => write!(formatter, "Authentication error: {}. \nPlease restart device and try again", error)
        }
    }
}

// Реалізація Error для ScannerError
impl Error for ScannerError { }
