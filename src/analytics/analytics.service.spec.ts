import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { TrafficAnalytics } from './schemas/traffic-analytics.schema';
import { FinancialReport } from './schemas/financial-report.schema';
import { Booking } from '../booking/schemas/booking.schema';
import { Payment } from '../payment/schemas/payment.schema';
const axios = require('axios/dist/node/axios.cjs');

jest.mock('axios/dist/node/axios.cjs');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let trafficModel: any;

    const mockTrafficModel = {
        create: jest.fn().mockImplementation(data => Promise.resolve(data)),
        countDocuments: jest.fn(),
        distinct: jest.fn(),
        aggregate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
        }),
        find: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([]),
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: getModelToken(TrafficAnalytics.name),
                    useValue: mockTrafficModel,
                },
                {
                    provide: getModelToken(FinancialReport.name),
                    useValue: {},
                },
                {
                    provide: getModelToken(Booking.name),
                    useValue: {},
                },
                {
                    provide: getModelToken(Payment.name),
                    useValue: {},
                },
                {
                    provide: getModelToken('Commission'),
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
        trafficModel = module.get(getModelToken(TrafficAnalytics.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('trackTraffic', () => {
        it('should resolve location from IP if not provided', async () => {
            const mockIp = '8.8.8.8';
            const mockLocation = {
                country_name: 'United States',
                region: 'California',
                city: 'Mountain View',
                latitude: 37.4223,
                longitude: -122.0847,
            };

            mockedAxios.get.mockResolvedValueOnce({ data: mockLocation });

            const trafficData = {
                businessId: '60d5ecb54f1f7d001f8e4e1a',
                visitorId: 'visitor123',
                sessionId: 'session123',
                pagePath: '/',
                ip: mockIp,
                userAgent: {
                    browser: 'Chrome',
                    os: 'Windows',
                    device: 'desktop',
                    source: 'UA String',
                },
            };

            await service.trackTraffic(trafficData);

            expect(mockedAxios.get).toHaveBeenCalledWith(`https://ipapi.co/${mockIp}/json/`);
            expect(trafficModel.create).toHaveBeenCalledWith(expect.objectContaining({
                location: {
                    country: 'United States',
                    region: 'California',
                    city: 'Mountain View',
                    latitude: 37.4223,
                    longitude: -122.0847,
                }
            }));
        });

        it('should not resolve location for local IP', async () => {
            const mockIp = '127.0.0.1';

            const trafficData = {
                businessId: '60d5ecb54f1f7d001f8e4e1a',
                visitorId: 'visitor123',
                sessionId: 'session123',
                pagePath: '/',
                ip: mockIp,
                userAgent: {
                    browser: 'Chrome',
                    os: 'Windows',
                    device: 'desktop',
                    source: 'UA String',
                },
            };

            await service.trackTraffic(trafficData);

            expect(mockedAxios.get).not.toHaveBeenCalled();
            expect(trafficModel.create).toHaveBeenCalledWith(expect.objectContaining({
                location: undefined
            }));
        });
    });

    describe('getDetailedTraffic', () => {
        it('should return recent traffic logs', async () => {
            const businessId = '60d5ecb54f1f7d001f8e4e1a';
            const start = new Date();
            const end = new Date();

            await service.getDetailedTraffic(businessId, start, end);

            expect(trafficModel.find).toHaveBeenCalledWith({
                businessId: expect.any(Object),
                timestamp: { $gte: start, $lte: end }
            });
        });
    });
});
