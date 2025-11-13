# Payment Setup Guide

## Quick Setup for Stripe Payments

### Step 1: Create a Stripe Account
1. Go to https://stripe.com and sign up
2. Complete your account setup
3. You'll be in **Test Mode** by default (perfect for testing)

### Step 2: Get Your API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_...`)
3. Copy your **Publishable key** (starts with `pk_test_...`) - Optional

### Step 3: Add Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: Your Stripe Secret Key (from Step 2)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### Step 4: Install Dependencies
If deploying locally or testing:
```bash
npm install
```

### Step 5: Deploy to Vercel
1. Push your code to GitHub
2. Vercel will automatically deploy
3. The API endpoint will be available at: `https://your-domain.vercel.app/api/create-checkout-session`

## Testing Payments

### Test Cards (Stripe Test Mode)
Use these cards to test payments:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

For all test cards:
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Test the Flow
1. Add items to cart
2. Click "Checkout"
3. You'll be redirected to Stripe Checkout
4. Use a test card to complete payment
5. You'll be redirected to the success page

## Going Live

When ready for real payments:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API Keys** from https://dashboard.stripe.com/apikeys
3. **Update Environment Variable** in Vercel with your live secret key
4. **Test with real card** (use a small amount first)

## Security Notes

- ✅ Never commit API keys to Git
- ✅ Always use environment variables
- ✅ Keep your secret key secure
- ✅ Use test mode during development
- ✅ Monitor payments in Stripe Dashboard

## Troubleshooting

### "Module not found: stripe"
- Run `npm install` to install dependencies
- Make sure `package.json` includes `stripe` dependency

### "Invalid API Key"
- Check that `STRIPE_SECRET_KEY` is set in Vercel
- Verify the key starts with `sk_test_` (test) or `sk_live_` (live)
- Redeploy after adding environment variables

### "CORS error"
- The API function includes CORS headers
- Make sure you're calling from the same domain

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

