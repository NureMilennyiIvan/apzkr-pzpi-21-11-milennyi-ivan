use async_trait::async_trait;
use crate::db::traits::AuthService;

// Асинхронний трейт для управління комірниками, розширює AuthService
#[async_trait]
pub(crate) trait StorekeeperManage<T>: AuthService<T> {

}
