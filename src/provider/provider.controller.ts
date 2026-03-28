import {
  Controller,
  Body,
  Param,
  HttpStatus,
  Res,
  ValidationPipe,
  UsePipes,
  Put,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { WinstonLoggerService } from '../common/logger.service';
import { AddNewParticipant } from './dto/addnew-participant.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService,
    private readonly logger: WinstonLoggerService,
  ) {}

  @Get('/fetchProviderDetails/:userId')
  async fetchProviderDetails(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    try {
      const fetchProviderDetail =
        await this.providerService.findOneByUserId(userId);
      if (fetchProviderDetail) {
        this.logger.info('Provider detail fetch successfully');
        return response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: 'Provider detail fetch successfully',
          data: fetchProviderDetail,
        });
      } else {
        this.logger.info('Provider not found');
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Provider not found',
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get('/fetchParticipant/:providerId')
  async fetchParticipantByProviderId(
    @Param('providerId') providerId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Res() response: Response,
  ) {
    try {
      const fetchParticipant =
        await this.providerService.findParticipantByProviderId(
          page || 1,
          pageSize || 10,
          providerId,
        );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Participant fetch successfully',
        data: fetchParticipant,
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get('/fetchParticipantList/:providerId')
  async fetchParticipantListByProviderId(
    @Param('providerId') providerId: string,
    @Res() response: Response,
  ) {
    try {
      const fetchParticipant =
        await this.providerService.findParticipantListByProviderId(providerId);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Participant fetch successfully',
        data: fetchParticipant,
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Post('/addParticipant')
  @UsePipes(new ValidationPipe())
  async addNewParticipant(
    @Res() response: Response,
    @Body() updateProviderDto: AddNewParticipant,
  ) {
    try {
      const fetchProvider = await this.providerService.findOneByProviderId(
        updateProviderDto.providerId,
      );
      if (fetchProvider) {
        const checkEmailExist = await this.providerService.findEmail(
          updateProviderDto.email,
        );
        if (!checkEmailExist) {
          const checkUserName = await this.providerService.findUserName(
            updateProviderDto.userName,
          );
          if (!checkUserName) {
            const createObject: CreateProviderDto = {
              name: updateProviderDto.userName,
              email: updateProviderDto.email,
              password: updateProviderDto.password,
              role: 'User',
              isPaticipant: true,
              providerId: updateProviderDto.providerId,
              viewResult: updateProviderDto.viewResult,
            };
            const createParticipant =
              await this.providerService.createParticipant(createObject);
            this.logger.info('Participant create successfully');
            return response.status(HttpStatus.OK).json({
              statusCode: HttpStatus.OK,
              message: 'Participant create successfully',
              data: createParticipant,
            });
          } else {
            this.logger.info('User name already exist');
            return response.status(HttpStatus.CONFLICT).json({
              statusCode: HttpStatus.CONFLICT,
              message: 'User name already exist',
            });
          }
        } else {
          this.logger.info('Email already exist');
          return response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: 'Email already exist',
          });
        }
      } else {
        this.logger.info('Provider not found');
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Provider not found',
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Put('/resetPassword')
  @UsePipes(new ValidationPipe())
  async resetPassword(
    @Res() response: Response,
    @Body() ResetPasswordDto: ResetPasswordDto,
  ) {
    try {
      const fetchProviderDetails: User | null =
        await this.providerService.findUserByUserId(ResetPasswordDto.userId);
      if (fetchProviderDetails) {
        const comaprePass = await bcrypt.compare(
          ResetPasswordDto.oldPassword,
          fetchProviderDetails.password,
        );
        if (comaprePass) {
          const updatePassword =
            await this.providerService.resetPassword(ResetPasswordDto);
          if (updatePassword) {
            this.logger.info('Password updated successfully');
            return response.status(HttpStatus.OK).json({
              statusCode: HttpStatus.OK,
              message: 'Password updated successfully',
            });
          } else {
            this.logger.info('Error while update password');
            return response.status(HttpStatus.BAD_REQUEST).json({
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error while update password',
            });
          }
        } else {
          this.logger.info('Old password is wrong');
          return response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Old password is wrong',
          });
        }
      }
      this.logger.info('Provider not found');
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Provider not found',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Put(':userId')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('userId') userId: string,
    @Res() response: Response,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    try {
      const fetchProvider = await this.providerService.findOneByUserId(userId);
      if (fetchProvider) {
        const updateProviderCode = await this.providerService.update(
          fetchProvider.id,
          updateProviderDto,
        );
        if (updateProviderCode) {
          this.logger.info('Code update successfully');
          return response.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: 'Code update successfully',
          });
        } else {
          this.logger.info('Error while update code');
          return response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: 'Error while update code',
          });
        }
      }
      this.logger.info('Provider not found');
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Provider not found',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
