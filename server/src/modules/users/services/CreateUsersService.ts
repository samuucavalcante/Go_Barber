import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUsersService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUsersExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUsersExists) {
      throw new AppError('Email adress already used.');
    }
    const hashedPassowrd = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassowrd,
    });

    await usersRepository.save(user);
    return user;
  }
}

export default CreateUsersService;