import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt/jwt.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    UsersModule,
    PassportModule,
  ],
  providers: [AuthService],
  exports: [AuthService /*JwtStrategy*/],
})
export class AuthModule {}
