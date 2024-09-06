import { TestingModule, Test } from '@nestjs/testing';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';

const testUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'jdoe@none.com',
    username: 'jdoe',
    password: 'somepassword',
    refreshToken: 'sometoken',
};

const testAuthDto: AuthDto = {
    username: 'jdoe',
    password: 'somepassword',
};

const testRequest: Request = {
    user: {},
} as Request;

const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    logout: jest.fn(),
    refreshTokens: jest.fn(),
};

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = app.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signup', () => {
        it('should call signUp service', () => {
            authController.signup(testUserDto);
            expect(mockAuthService.signUp).toHaveBeenCalled();
        });
    });

    describe('signin', () => {
        it('should call signIn service', () => {
            authController.signin(testAuthDto);
            expect(mockAuthService.signIn).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should call logout service', () => {
            authController.logout(testRequest);
            expect(mockAuthService.logout).toHaveBeenCalled();
        });
    });

    describe('refresh', () => {
        it('should call refreshTokens service', () => {
            authController.refreshTokens(testRequest);
            expect(mockAuthService.refreshTokens).toHaveBeenCalled();
        });
    });
});
