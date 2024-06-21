// Клас для відображення інформації про комірника
export class StorekeeperVM {
    id: number; // Ідентифікатор комірника
    name: string; // Ім'я комірника
    surname: string; // Прізвище комірника

    constructor(id: number, name: string, surname: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }
}