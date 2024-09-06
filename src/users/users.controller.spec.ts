import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';

const testUser: User = {
    id: new ObjectId(),
    name: 'John Doe',
    username: 'jdoe',
    password: 'somepassword',
};

const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

describe('UsersController', () => {
    let usersController: UsersController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        usersController = app.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });

    describe('create', () => {
        it('should call create service', () => {
            usersController.create(testUser);
            expect(mockUsersService.create).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should call findAll service', () => {
            usersController.findAll();
            expect(mockUsersService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should call findOne service', () => {
            usersController.findOne('someid');
            expect(mockUsersService.findOne).toHaveBeenCalled();
        });
    });

    describe('findByUsername', () => {
        it('should call findByUsername service', () => {
            usersController.findByUsername('someusername');
            expect(mockUsersService.findByUsername).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should call update service', () => {
            usersController.update('someid', testUser);
            expect(mockUsersService.update).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should call remove service', () => {
            usersController.remove('someid');
            expect(mockUsersService.remove).toHaveBeenCalled();
        });
    });
});
