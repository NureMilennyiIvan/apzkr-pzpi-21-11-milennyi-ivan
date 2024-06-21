// Клас, що представляє вівцю
export class Sheep {
    id: number | null; // Ідентифікатор вівці
    birth_date: number; // Дата народження вівці у секундах
    breed_id: number; // Ідентифікатор породи
    weight: number; // Вага вівці
    sex: boolean; // Стать вівці (true - самець, false - самка)
    temperature_scanner_id: number | null; // Ідентифікатор температурного сканера
    shepherd_id: number | null; // Ідентифікатор пастуха

    constructor(id: number | null, birthDate: number, breedId: number, weight: number, sex: boolean, temperatureScannerId: number | null, shepherdId: number | null) {
        this.id = id;
        this.birth_date = birthDate;
        this.breed_id = breedId;
        this.weight = weight;
        this.sex = sex;
        this.temperature_scanner_id = temperatureScannerId;
        this.shepherd_id = shepherdId;
    }
}