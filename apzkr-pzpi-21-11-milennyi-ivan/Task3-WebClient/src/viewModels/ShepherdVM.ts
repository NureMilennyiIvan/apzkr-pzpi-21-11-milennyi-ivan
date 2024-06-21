// Клас для відображення інформації про пастуха
export class ShepherdVM {
    id: number; // Ідентифікатор пастуха
    name: string; // Ім'я пастуха
    surname: string; // Прізвище пастуха

    constructor(id: number, name: string, surname: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }
}