use std::io;
use std::thread::sleep;
use std::time::Duration;

// Функція для відображення повідомлення
pub(crate) fn display(message: &str) -> () {
    println!("{}", message);
}

// Функція для продовження дії після введення користувачем
pub(crate) fn continue_action() -> () {
    display("Press ENTER to try again.");  // Відображення повідомлення
    let mut input = String::new();
    if let Err(error) = io::stdin().read_line(&mut input) {  // Зчитування введення користувача
        panic(&error.to_string())  // Виклик функції panic у разі помилки
    }
}

// Функція для паніки з повідомленням
pub(crate) fn panic(message: &str) -> ! {
    display(&message.to_string());  // Відображення повідомлення про паніку
    loop {
        sleep(Duration::from_millis(100000))  // Затримка для імітації нескінченного циклу
    }
}
