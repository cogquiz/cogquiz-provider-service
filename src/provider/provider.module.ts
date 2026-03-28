import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { Provider } from './entities/provider.entity';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { WinstonLoggerModule } from '../common/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Provider]),
    WinstonLoggerModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
