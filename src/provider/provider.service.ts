import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerTable: Repository<Provider>,
    @InjectRepository(User)
    private readonly userTable: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileTable: Repository<UserProfile>,
  ) {}

  async findOneByUserId(user_id: string) {
    return await this.providerTable.findOne({ where: { user_id } });
  }

  async findParticipantByProviderId(page: number, pageSize: number, providerId: string) {
    const [fetchParticipant, totalCount] = await this.userTable.findAndCount({
      where: { providerId: providerId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { lastModified: 'DESC' },
    });

    return {
      data: fetchParticipant,
      page: Number(page),
      pageSize: Number(pageSize),
      totalCount,
    };
  }

  async findParticipantListByProviderId(providerId: string) {
    return await this.userTable.find({
      where: { providerId: providerId },
      select: ['id', 'name'],
    });
  }

  async findUserByUserId(userId: string) {
    return await this.userTable.findOne({ where: { id: userId } });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const bcryptPassword: string = await bcrypt
      .genSalt(10)
      .then((salt: string) => bcrypt.hash(resetPasswordDto.newPassword, salt));
    const updateUserPassword: any = await this.userTable.update(
      { id: resetPasswordDto.userId },
      { password: bcryptPassword },
    );
    return updateUserPassword;
  }

  async findEmail(email: string) {
    return await this.userTable.findOne({ where: { email: email } });
  }

  async findUserName(userName: string) {
    return await this.userTable.findOne({ where: { name: userName } });
  }

  findOneByProviderId(id: string) {
    return this.providerTable.findOne({ where: { id } });
  }

  async createParticipant(createProviderDto: CreateProviderDto) {
    const bcryptPassword = await bcrypt
      .genSalt(10)
      .then((salt: string) => bcrypt.hash(createProviderDto.password, salt));
    const user: User = new User();
    user.name = createProviderDto.name;
    user.email = createProviderDto.email;
    user.password = bcryptPassword;
    user.role = createProviderDto.role;
    user.isPaticipant = createProviderDto.isPaticipant;
    user.providerId = createProviderDto.providerId;
    user.viewResult = createProviderDto.viewResult;
    user.isActive = true;
    user.lastModified = new Date();
    user.isVerified = true;
    const createdUser: User = await this.userTable.save(user);

    const userProfile: UserProfile = new UserProfile();
    userProfile.user_id = createdUser.id;
    userProfile.first_name = '';
    userProfile.last_name = '';
    userProfile.birth_date = '';
    userProfile.isActive = true;
    userProfile.lastModified = new Date();
    await this.userProfileTable.save(userProfile);
    return createdUser;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    return await this.providerTable.update(
      { id: id },
      { code: updateProviderDto.code },
    );
  }
}
