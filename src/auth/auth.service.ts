import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { jwtConstants } from './constants'

@Injectable()
export class AuthService {
  constructor (
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser (username: string, password: string) {
    this.logger.debug({
      event: 'validateUser.validation.input',
      data: { username, password }
    })

    const user = await this.userService.findOne(username)

    if (user && user.password === password) {
      const { password, ...result } = user
      this.logger.info({
        name: 'user.authentication.success',
        data: { user: result }
      })
      return result
    }
    this.logger.info({
      name: 'user.authentication.fail',
      data: { message: 'user not found or password incorrect' }
    })
    return null
  }

  async login (userLoginInput: User) {
    this.logger.debug({
      event: 'login.input',
      data: { input: userLoginInput }
    })

    const user = await this.userService.findOne(userLoginInput.username)
    this.logger.debug({
      event: 'login.input',
      data: { input: user }
    })

    return {
      access_token: this.jwtService.sign(
        {
          username: user.username,
          sub: user.id
        },
        { secret: 'secret' }
      )
    }
  }
}
