# Vercel Domains Page Replica

A replica of Vercel's domains page with shopping cart functionality and Stripe payment integration.

## Features

- Animated hero text with per-character blur effects
- Product catalog with shopping cart
- Stripe payment integration
- Dark mode support
- Responsive design

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Stripe (see Payment Setup below)
4. Deploy to Vercel

## Payment Setup (Stripe)

**📖 See [SETUP_PAYMENTS.md](./SETUP_PAYMENTS.md) for detailed instructions**

### Quick Setup:

1. **Create Stripe Account**: https://stripe.com
2. **Get API Key**: Dashboard → Developers → API keys → Copy Secret key
3. **Add to Vercel**: Project Settings → Environment Variables → Add `STRIPE_SECRET_KEY`
4. **Deploy**: Push to GitHub and Vercel will auto-deploy

### Test Cards:
- Success: `4242 4242 4242 4242`
- Any future expiry date and CVC

## File Structure

```
/
├── api/
│   └── create-checkout-session.js  # Stripe checkout API endpoint
├── index.html
├── success.html                    # Payment success page
├── styles.css
├── script.js
├── package.json
└── SETUP_PAYMENTS.md              # Detailed payment setup guide
```

## How It Works

1. User adds items to cart
2. Clicks "Checkout" button
3. Frontend calls `/api/create-checkout-session` with cart items
4. Serverless function creates Stripe Checkout session
5. User is redirected to Stripe's secure checkout page
6. After payment, user is redirected to `/success.html`

## Deployment

1. Push to GitHub
2. Vercel will auto-deploy
3. Add `STRIPE_SECRET_KEY` environment variable in Vercel dashboard
4. Test the payment flow with test cards

## Security Notes

- ✅ Never commit API keys to Git
- ✅ Always use environment variables
- ✅ Test in Stripe test mode before going live
