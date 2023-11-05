import {Seeder, SeederFactoryManager} from "typeorm-extension";
import {DataSource} from "typeorm";
import {User} from "../../entities/user.entity";

export default class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const repository = dataSource.getRepository(User);

        await repository.insert([
            {
                email: 'leecoder5359@gmail.com',
                name: 'leecoder',
                password: '12345'
            }
        ]);
    }

}