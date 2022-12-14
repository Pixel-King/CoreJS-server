import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { SetMetadata } from '@nestjs/common';
import { updatePasedTest, updateReadedArticle } from '../dto/updatePasTest.dto';
import { ChangeUserInfDto } from '../dto/changeUserInf.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  public getUsers() {
    return this.usersService.findAllUsers();
    // .forEach(el => this.usersService.getUserToResponse(el));
  }

  @Get(':id')
  public async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findUserBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.getUserToResponse(user);
  }

  @Public()
  @Post('resetprogress/:id')
  public async resetProgress(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.usersService.resetProgress(id);
    if (user) {
      return user;
    }
    return null;
  }

  @Post('changeinf/:id')
  public async changeInfAboutUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userInfo: ChangeUserInfDto,
  ) {
    const user = await this.usersService.changeUserInf(id, userInfo);

    if (!user) {
      return null;
    }

    return { success: true, email: user.email, userName: user.userName };
  }

  @Post('updatepastest/:id')
  public async addPasedTestToUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userInfo: updatePasedTest,
  ) {
    const user = await this.usersService.updatePasedTests(id, userInfo);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { success: true };
  }

  @Post('updaterarticle/:id')
  public async updateRating(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() artInf: updateReadedArticle,
  ) {
    const user = await this.usersService.updateReadedArticle(id, artInf);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { success: true };
  }

  @Post()
  @HttpCode(201)
  public async createUser(@Body() userInfo: CreateUserDto) {
    const user = await this.usersService.createUser(userInfo);

    if (!user) {
      throw new ConflictException('User with such email exists');
    }

    return user;
  }

  @Delete(':id')
  public async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.deleteUser({ id });

    if (!user) {
      throw new ConflictException('User with this "id" is absent');
    }

    return user;
  }
}
