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
      // DISABLED: Participant assignment through providers is no longer required
      // Tests are now freely accessible without provider assignment
      this.logger.info('addParticipant endpoint disabled - free access enabled');
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Participant assignment is disabled. Tests are now freely accessible without provider login.',
        disabled: true,
      });
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
      // DISABLED: Provider password reset is disabled
      // Provider login is no longer required for test access
      this.logger.info('resetPassword endpoint disabled for providers');
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Provider password reset is disabled. Provider login is no longer required.',
        disabled: true,
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