import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { User, CreateUserDto, LoginDto } from '../types';

export class UserService {
  private userRepository = new UserRepository();

  async register(data: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new Error('User already exists');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepository.create({ ...data, password: hashedPassword });
  }

  async login(data: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return { user, token };
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}