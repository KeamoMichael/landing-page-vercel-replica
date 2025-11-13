# Going Live with Stripe Payments

## Step-by-Step Guide to Accept Real Payments

### Step 1: Complete Stripe Account Setup

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Complete Account Activation**:
   - Go to **Settings** → **Account**
   - Complete all required business information:
     - Business type and details
     - Bank account for payouts
     - Tax information
     - Identity verification (may be required)
   - Follow Stripe's prompts to complete activation

3. **Activate Your Account**:
   - Stripe will guide you through the activation process
   - This may take a few minutes to a few days depending on verification

### Step 2: Switch to Live Mode

1. **Toggle to Live Mode**:
   - In Stripe Dashboard, toggle the switch from "Test mode" to "Live mode" (top right)
   - You'll see a confirmation dialog

2. **Get Live API Keys**:
   - Go to: https://dashboard.stripe.com/apikeys
   - Make sure you're in **Live mode** (not Test mode)
   - Copy your **Live Secret key** (starts with `sk_live_...`)
   - ⚠️ **Important**: This is different from your test key!

### Step 3: Update Vercel Environment Variable

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Open Your Project** → **Settings** → **Environment Variables**
3. **Update STRIPE_SECRET_KEY**:
   - Find `STRIPE_SECRET_KEY` in the list
   - Click to edit
   - Replace the test key (`sk_test_...`) with your **live key** (`sk_live_...`)
   - Make sure it's set for **Production** environment
   - Save

4. **Keep Test Key for Development** (Optional but Recommended):
   - You can have both keys:
     - `STRIPE_SECRET_KEY` for Production = Live key
     - Create `STRIPE_SECRET_KEY_TEST` for Preview/Development = Test key
   - This allows you to test in preview deployments while using live in production

### Step 4: Redeploy Your Site

1. **In Vercel Dashboard**:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on latest deployment
   - Click **Redeploy**
   - Confirm

2. **Verify Environment Variable**:
   - After redeploy, check that the live key is being used
   - You can verify in Vercel → Settings → Environment Variables

### Step 5: Test with Real Payment (Small Amount First!)

1. **Test with a Small Real Payment**:
   - Use your own credit card
   - Make a small test purchase (e.g., $1.00)
   - Verify the payment goes through

2. **Check Stripe Dashboard**:
   - Go to: https://dashboard.stripe.com/payments
   - Make sure you're in **Live mode**
   - You should see the real payment

3. **Verify Payouts**:
   - Go to: https://dashboard.stripe.com/payouts
   - Check that your bank account is set up correctly
   - Stripe typically pays out on a rolling basis (2-7 days)

### Step 6: Monitor and Maintain

1. **Set Up Webhooks** (Recommended):
   - Go to: https://dashboard.stripe.com/webhooks
   - Add webhook endpoint: `https://your-domain.vercel.app/api/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - This allows you to handle payment confirmations server-side

2. **Enable Email Receipts**:
   - Stripe automatically sends receipts to customers
   - Configure in: Settings → Emails

3. **Set Up Alerts**:
   - Go to: Settings → Notifications
   - Enable alerts for:
     - Failed payments
     - Disputes/chargebacks
     - Payouts

## Important Considerations

### Security
- ✅ Never share your live secret key
- ✅ Keep test and live keys separate
- ✅ Use environment variables (never hardcode)
- ✅ Monitor for suspicious activity

### Legal & Compliance
- ✅ Display terms of service and privacy policy
- ✅ Show refund policy clearly
- ✅ Comply with PCI DSS (Stripe handles this)
- ✅ Follow local tax regulations

### Testing Before Going Live
- ✅ Test the entire checkout flow
- ✅ Test with different card types
- ✅ Test error scenarios (declined cards, etc.)
- ✅ Verify success/cancel redirects work

### Going Live Checklist
- [ ] Stripe account fully activated
- [ ] Business information complete
- [ ] Bank account connected for payouts
- [ ] Live API key added to Vercel
- [ ] Site redeployed with live key
- [ ] Tested with small real payment
- [ ] Webhooks configured (optional but recommended)
- [ ] Email notifications set up
- [ ] Terms of service and privacy policy added to site

## Support Resources

- **Stripe Support**: https://support.stripe.com
- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Status**: https://status.stripe.com

## Troubleshooting

### "Your account cannot currently make live charges"
- Complete account activation in Stripe
- Verify your business information
- Contact Stripe support if needed

### "Invalid API Key"
- Make sure you're using the live key (`sk_live_...`) not test key
- Verify the key is correctly set in Vercel
- Redeploy after updating environment variable

### Payments Not Appearing
- Check you're viewing Live mode in Stripe dashboard
- Verify the environment variable is set for Production
- Check Vercel function logs for errors

