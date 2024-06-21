use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use crate::configs::api_doc;

// Структура обгортки для Swagger UI
pub(crate) struct SwaggerUiWrapper;

// Метод для створення та налаштування Swagger UI
impl SwaggerUiWrapper{
    pub fn build_swagger_ui() -> SwaggerUi{
        // Отримання OpenAPI документації
        let openapi = api_doc::ApiDoc::openapi();
        // Налаштування Swagger UI з шляхами до документації
        SwaggerUi::new("/swagger-ui/{_:.*}").url("/api-docs/openapi.json", openapi)
    }
}