import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthCheckController {
    constructor() {}

    @Get('healthcheck')
    health() {
        return { status: 'ok' };
    }
}