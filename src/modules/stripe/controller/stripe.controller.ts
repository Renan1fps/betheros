import {
    Controller, Post, Headers,
    Req, RawBodyRequest, Res, Request, UseGuards, ConflictException,
} from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from "@modules/stripe/services/stripe.service";
import { StripeWebhookUseCase } from "@modules/stripe/application/stripe-webhook.use-case";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";

@Controller('stripe')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly stripeWebhookUseCase: StripeWebhookUseCase,
    ) {}

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async checkout(@Request() req, @Res() res: Response) {
        const url = await this.stripeService.createCheckoutSession(
            req.user.id,
            req.user.email,
        );
        return res.json({ url });
    }

    @Post('portal')
    @UseGuards(JwtAuthGuard)
    async portal(@Request() req, @Res() res: Response) {
        const url = await this.stripeService.createPortalSession(
            req.user.stripeCustomerId,
        );
        return res.json({ url });
    }

    @Post('webhook')
    async webhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string,
        @Res() res: Response,
    ) {
        try {
            const event = this.stripeService.constructWebhookEvent(
                req.rawBody!,
                signature,
            );
            await this.stripeWebhookUseCase.execute(event);
            return res.sendStatus(200);
        } catch (err) {
            if(err instanceof ConflictException) {
                return res.sendStatus(200);
            }
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}