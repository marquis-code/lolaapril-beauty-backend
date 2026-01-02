// cache/cache.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';

@Global() // Makes cache available globally without importing in every module
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const redisUsername = configService.get<string>('REDIS_USERNAME');
        const redisTLS = configService.get<string>('REDIS_TLS');
        const nodeEnv = configService.get<string>('NODE_ENV');

        // Determine if TLS should be used based on REDIS_TLS env variable
        const useTLS = redisTLS === 'true';

        console.log('🔴 Cache Module - Redis Configuration:');
        console.log(`   Host: ${redisHost}`);
        console.log(`   Port: ${redisPort}`);
        console.log(`   Username: ${redisUsername || 'default'}`);
        console.log(`   Password: ${redisPassword ? '✓ Set' : '✗ Not set'}`);
        console.log(`   REDIS_TLS: ${redisTLS}`);
        console.log(`   Using TLS: ${useTLS}`);
        console.log(`   Environment: ${nodeEnv}`);

        // Build socket config
        const socketConfig: any = {
          host: redisHost,
          port: redisPort,
          connectTimeout: 10000,
          reconnectStrategy: (retries: number) => {
            const delay = Math.min(retries * 50, 2000);
            console.log(`🔄 Redis retry attempt ${retries}, waiting ${delay}ms`);
            return delay;
          },
        };

        // ✅ ONLY add TLS if explicitly enabled
        if (useTLS) {
          socketConfig.tls = true;
          console.log('   ✅ TLS enabled in socket config');
        } else {
          console.log('   ✅ TLS disabled (not added to socket config)');
        }

        return {
          store: await redisStore({
            socket: socketConfig,
            password: redisPassword,
            username: redisUsername || 'default',
            ttl: 3600 * 1000, // 1 hour in milliseconds
          }),
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}