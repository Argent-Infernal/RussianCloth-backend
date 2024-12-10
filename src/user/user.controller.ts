import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get('profile')
    async getProfile(@CurrentUser('id') id:string){
        return this.userService.getById(id)
    }

    @Auth()
    @Put('update')
    async update(@CurrentUser('id') id:string, @Body() dto:UserDto){
        return this.userService.update(id, dto)
    }

    @Auth()
    @Get('check-is-admin')
    async checkIsAdmin(@CurrentUser('id') id:string){
        return this.userService.checkIsAdmin(id)
    }

    @UseGuards(RolesGuard)
    @Auth()
    @Get('get-all')
    async getAll(){
        return this.userService.getAll()
    }

    @Auth()
    @Get('get-orders')
    async getOrders(@CurrentUser('id') id:string){
        return this.userService.getOrders(id)
    }

    @UseGuards(RolesGuard)
    @Auth()
    @Put(':id/role')
    async changeRole(
        @Param('id') userId: string,
        @Body('role') newRole: string,
    ) {
        return this.userService.changeUserRole(userId, newRole);
    }
  
}
