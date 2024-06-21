use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

// Структура, що представляє корм
#[derive(Debug, Validate, Deserialize, Serialize, FromRow, ToSchema)]
pub(crate) struct Feed {
    id: Option<u64>, // Ідентифікатор корму
    #[validate(range(min = 1))]
    amount: u32, // Кількість корму
    #[validate(length(min = 1))]
    name: String, // Назва корму
    #[validate(range(min = 1))]
    calories: u32, // Калорійність корму
    #[validate(range(min = 1))]
    fat: u32, // Вміст жиру
    #[validate(range(min = 1))]
    protein: u32, // Вміст білків
    #[validate(range(min = 1))]
    carbohydrates: u32 // Вміст вуглеводів
}

impl Feed {
    // Отримання ідентифікатора корму
    pub fn id(&self) -> Option<u64> {
        self.id
    }

    // Встановлення ідентифікатора корму
    pub fn set_id(&mut self, id: u64) -> () {
        self.id = Some(id);
    }

    // Отримання кількості корму
    pub fn amount(&self) -> u32 {
        self.amount
    }

    // Отримання назви корму
    pub fn name(&self) -> &str {
        &self.name
    }

    // Отримання калорійності корму
    pub fn calories(&self) -> u32 {
        self.calories
    }

    // Отримання вмісту жиру
    pub fn fat(&self) -> u32 {
        self.fat
    }

    // Отримання вмісту білків
    pub fn protein(&self) -> u32 {
        self.protein
    }

    // Отримання вмісту вуглеводів
    pub fn carbohydrates(&self) -> u32 {
        self.carbohydrates
    }
}
