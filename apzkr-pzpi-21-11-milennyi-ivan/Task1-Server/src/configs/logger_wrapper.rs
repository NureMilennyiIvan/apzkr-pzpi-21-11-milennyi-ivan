use flexi_logger::{Cleanup, Criterion, FileSpec, Logger as FlexiLogger, Naming, opt_format, WriteMode};

// Структура обгортки для логера
pub(crate) struct LoggerWrapper{}

impl LoggerWrapper{
    // Метод для ініціалізації логера
    pub fn init_logger(directory_name: &str, file_basename: &str, extension_suffix: &str, file_length_bytes: u64) -> Self{
        // Налаштування і запуск логера
        FlexiLogger::try_with_str("info").unwrap()
            .log_to_file(FileSpec::default().directory(directory_name).basename(file_basename).suffix(extension_suffix))
            .format(opt_format)
            .write_mode(WriteMode::BufferAndFlush)
            .rotate(Criterion::Size(file_length_bytes), Naming::Numbers, Cleanup::Never)
            .append()
            .start()
            .unwrap_or_else(|e| panic!("Logger initialization failed: {}", e));

        LoggerWrapper{}
    }
}
impl Default for LoggerWrapper{
    // Метод для налаштування логера за замовчуванням
    fn default() -> Self {
        FlexiLogger::try_with_str("info").unwrap()
            .log_to_file(FileSpec::default().directory("logs").basename("log").suffix("log"))
            .format(opt_format)
            .write_mode(WriteMode::BufferAndFlush)
            .rotate(Criterion::Size(10_485_760), Naming::Numbers, Cleanup::Never)
            .append()
            .start()
            .unwrap_or_else(|e| panic!("Logger initialization failed: {}", e));

        LoggerWrapper{}
    }
}