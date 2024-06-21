// Клас для відображення інформації про породу
export class BreedVM {
    id: number; // Ідентифікатор породи
    name: string; // Назва породи
    info: string; // Інформація про породу
    feedName: string; // Назва корму, який використовується для цієї породи
    sheepCount: number; // Кількість овець цієї породи

    constructor(id: number, name: string, info: string, feedName: string, sheepCount: number) {
        this.id = id;
        this.name = name;
        this.info = info;
        this.feedName = feedName;
        this.sheepCount = sheepCount;
    }
}