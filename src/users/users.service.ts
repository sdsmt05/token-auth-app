import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: MongoRepository<User>,
    ) {}

    async create(user) {
        if (!user || !user.name || !user.username || !user.password) {
            throw new BadRequestException(
                `A user must have at least name, username, and password defined.`,
            );
        }
        const newUser = await this.usersRepository.find({
            username: user.username,
        });
        if (newUser.length >= 1) {
            throw new BadRequestException(`User already exists`);
        }
        return await this.usersRepository.save(new User(user));
    }

    findAll() {
        return this.usersRepository.find();
    }

    async findOne(id): Promise<any> {
        const user =
            ObjectId.isValid(id) && (await this.usersRepository.findOne(id));
        if (!user) {
            throw new NotFoundException();
        }
        return await this.usersRepository.findOne(id);
    }

    async findByUsername(username): Promise<any> {
        const user = await this.usersRepository.findOneBy({
            username: username,
        });
        // if (!user) {
        //   throw new NotFoundException();
        // }
        return user;
    }

    async update(id, user) {
        const exists =
            ObjectId.isValid(id) && (await this.usersRepository.findOne(id));
        if (!exists) {
            throw new NotFoundException();
        }
        await this.usersRepository.update(id, user);
    }

    async remove(id) {
        const exists =
            ObjectId.isValid(id) && (await this.usersRepository.findOne(id));
        if (!exists) {
            throw new NotFoundException();
        }
        await this.usersRepository.delete(id);
    }
}
