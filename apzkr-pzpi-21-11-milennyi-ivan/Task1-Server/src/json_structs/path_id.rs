use serde::Deserialize;
use utoipa::{IntoParams, ToSchema};

// Структура, що представляє ідентифікатор шляху (Path ID)
#[derive(Deserialize, ToSchema, Debug, IntoParams)]
pub(crate) struct PathId {
   pub id: u64 // Ідентифікатор
}
