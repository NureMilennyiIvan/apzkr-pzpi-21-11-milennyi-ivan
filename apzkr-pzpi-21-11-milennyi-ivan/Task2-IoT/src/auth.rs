use std::io;
use std::io::Write;
use json::object;
use reqwest::Client;
use crate::scanner_error::ScannerError;

// Структура для збереження аутентифікаційних даних
pub(crate) struct TemperatureScannerAuthJson {
    pub id: u64,
    pub password: String,
}

// Функція для зчитування та форматування аргументів командного рядка
pub(crate) fn read_and_format_cli_arguments() -> Result<TemperatureScannerAuthJson, ScannerError> {
    let mut id_input = String::new();
    let mut password_input = String::new();

    // Запит введення ідентифікатора сканера
    print!("Provide scanner ID: ");
    if let Err(error) = io::stdout().flush() {
        return Err(ScannerError::ArgumentsError(error.to_string()));
    }
    if let Err(error) = io::stdin().read_line(&mut id_input) {
        return Err(ScannerError::ArgumentsError(error.to_string()));
    }
    // Парсинг введеного ідентифікатора
    let id: u64 = match id_input.trim().parse() {
        Ok(id) => id,
        Err(error) => return Err(ScannerError::ArgumentsError(error.to_string()))
    };

    // Запит введення пароля сканера
    print!("Provide scanner password: ");
    if let Err(error) = io::stdout().flush() {
        return Err(ScannerError::ArgumentsError(error.to_string()));
    }
    if let Err(error) = io::stdin().read_line(&mut password_input) {
        return Err(ScannerError::ArgumentsError(error.to_string()));
    }
    let password = password_input.trim().to_string();

    // Повернення структури з аутентифікаційними даними
    Ok(TemperatureScannerAuthJson { id, password })
}

// Функція для аутентифікації на сервері
pub(crate) async fn authenticate(auth: &TemperatureScannerAuthJson, server_url: &str) -> Result<(), ScannerError> {
    let client = Client::new();
    let url = format!("{}authenticate/{}", server_url, auth.id);
    let body = object!{
        password: *auth.password,
    }.dump();

    // Надсилання POST-запиту на сервер
    let response = match client.post(&url).header("Content-Type", "application/json").body(body).send().await {
        Ok(res) => res,
        Err(error) => return Err(ScannerError::AuthenticationError(error.to_string()))
    };

    // Обробка відповіді від сервера
    match response.json::<bool>().await {
        Ok(result) => if result {
            Ok(())
        } else {
            Err(ScannerError::AuthenticationError("This device failed authentication".to_string()))
        },
        Err(error) => Err(ScannerError::AuthenticationError(error.to_string()))
    }
}
