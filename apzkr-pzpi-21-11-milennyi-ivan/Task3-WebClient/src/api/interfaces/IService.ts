// Загальний інтерфейс служби, що визначає основні CRUD операції
export interface IService<Model, ViewModel> {
    // Метод для створення нового елементу
    create(item: Model): Promise<Model>;
    // Метод для видалення елементу за ідентифікатором
    delete(itemId: number): Promise<void>;
    // Метод для оновлення існуючого елементу
    update(item: Model): Promise<Model>;
    // Метод для отримання всіх елементів
    getAll(): Promise<Model[]>;
    // Метод для отримання елементу за ідентифікатором
    getById(id: number): Promise<Model | null>;
}