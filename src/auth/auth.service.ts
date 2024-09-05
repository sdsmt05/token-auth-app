import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(userId: any, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(userId: any, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>(
                        'JWT_REFRESH_SECRET',
                    ),
                    expiresIn: '7d',
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    async signUp(createUserDto: CreateUserDto): Promise<any> {
        const userExists = await this.usersService.findByUsername(
            createUserDto.username,
        );
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash,
        });
        const tokens = await this.getTokens(newUser.id, newUser.username);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(data: AuthDto) {
        const user = await this.usersService.findByUsername(data.username);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await argon2.verify(
            user.password,
            data.password,
        );
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: any) {
        return this.usersService.update(userId, { refreshToken: null });
    }

    async refreshTokens(userId: any, refreshToken: string) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}
