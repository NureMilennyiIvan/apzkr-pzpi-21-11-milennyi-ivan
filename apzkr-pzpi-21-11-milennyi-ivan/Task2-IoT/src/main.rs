mod scanner_error;
mod temperature;
mod auth;
mod utils;

use std::env;
use std::time::Duration;
use dotenv::dotenv;
use tokio::time::sleep as sleepAsync;
use crate::auth::{authenticate, read_and_format_cli_arguments};
use crate::temperature::{read_temperature, send_temperature};
use crate::utils::{continue_action, display, panic};

// Головна асинхронна функція
#[tokio::main]
async fn main() -> ! {
    // Завантаження змінних середовища з файлу .env
    dotenv().ok();

    // Отримання URL сервера зі змінної середовища
    let server_url: String = match env::var("SERVER_URL") {
        Ok(url) => url,
        Err(error) => panic(&error.to_string()) // Виклик паніки у разі помилки
    };

    // Читання та форматування аргументів командного рядка для аутентифікації
    let auth = match read_and_format_cli_arguments() {
        Ok(auth) => auth,
        Err(error) => {
            panic(&error.to_string()) // Виклик паніки у разі помилки
        }
    };

    // Аутентифікація на сервері
    if let Err(error) = authenticate(&auth, &server_url).await {
        panic(&error.to_string()) // Виклик паніки у разі помилки
    }

    // Початкова температура
    let mut temperature: u16 = 370;

    // Основний цикл програми
    loop {
        // Читання температури
        temperature = read_temperature(temperature);

        // Надсилання температури на сервер
        match send_temperature(auth.id, temperature, &server_url).await {
            Ok(result) => {
                display(&format!("{}", result)); // Відображення результату
                sleepAsync(Duration::from_millis(5000)).await; // Затримка на 5 секунд
            },
            Err(error) => {
                display(&format!("Fix and try again. {}", error.to_string())); // Відображення помилки
                continue_action(); // Продовження дії після помилки
            }
        }
    }
}
