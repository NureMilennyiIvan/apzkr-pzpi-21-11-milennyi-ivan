use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення корму (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct FeedVM {
    id: u64, // Ідентифікатор корму
    amount: u32, // Кількість корму
    name: String, // Назва корму
    calories: u32, // Калорійність корму
    fat: u32, // Вміст жиру
    protein: u32, // Вміст білків
    carbohydrates: u32, // Вміст вуглеводів
    breed_name: Option<String>, // Назва породи, для якої призначений корм
    sheep_count: Option<u64>, // Кількість овець, що споживають цей корм
}