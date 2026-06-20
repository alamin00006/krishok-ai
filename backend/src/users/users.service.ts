import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';

const scrypt = promisify(scryptCallback);

export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
        _count: { select: { questions: true, conversations: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async register(input: RegisterInput) {
    const name = input.name?.trim();
    const phone = this.validatePhone(input.phone);
    this.validatePassword(input.password);
    if (!name || name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters');
    }

    const existing = await this.prisma.user.findUnique({ where: { phone } });
    if (existing && !existing.passwordHash) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          passwordHash: await this.hashPassword(input.password),
        },
        select: { id: true, name: true, phone: true, createdAt: true },
      });
    }
    if (existing) {
      throw new ConflictException('A user with this phone already exists');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          phone,
          passwordHash: await this.hashPassword(input.password),
        },
        select: { id: true, name: true, phone: true, createdAt: true },
      });
      return user;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async login(input: LoginInput) {
    const phone = this.validatePhone(input.phone);
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (
      !user?.passwordHash ||
      !(await this.verifyPassword(input.password ?? '', user.passwordHash))
    ) {
      throw new UnauthorizedException('Phone number or password is incorrect');
    }
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  async updateName(id: string, nameValue: string) {
    const name = nameValue?.trim();
    if (!name || name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters');
    }
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { name },
        select: { id: true, name: true, phone: true, createdAt: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  private validatePhone(value: string) {
    const phone = value?.replace(/[\s-]/g, '');
    if (!phone || !/^(?:\+?88)?01[3-9]\d{8}$/.test(phone)) {
      throw new BadRequestException('Enter a valid Bangladesh phone number');
    }
    return phone;
  }

  private validatePassword(password: string) {
    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derived.toString('hex')}`;
  }

  private async verifyPassword(password: string, stored: string) {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const storedBuffer = Buffer.from(hash, 'hex');
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    return (
      storedBuffer.length === derived.length &&
      timingSafeEqual(storedBuffer, derived)
    );
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A user with this phone already exists');
    }
    throw error;
  }
}
