import Stripe from 'stripe';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Stripe requires the raw body for signature verification
  },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req.body) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');

  try {
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Connect to the database
    await connectToDatabase();

    // Log the event type for debugging
    console.log(`Received event: ${event.type}`);

    // Handle event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session);
        console.log('Subscription ID:', session.subscription);

        if (session.customer_email && session.subscription) {
          // Find the user by email and update their subscription status
          const user = await User.findOneAndUpdate(
            { email: session.customer_email },
            {
              $set: {
                subscriptionStatus: 'active',
                subscriptionID: session.subscription,
              },
            },
            { new: true }
          );
          console.log('User updated after session completed:', user);
        } else {
          console.log('Missing customer email or subscription ID in session data.');
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Invoice was paid:', invoice);

        if (invoice.customer_email) {
          // Mark the invoice as paid for the user
          await User.findOneAndUpdate(
            { email: invoice.customer_email },
            {
              $set: {
                lastInvoicePaid: invoice.id,
                subscriptionStatus: 'paid',
              },
            }
          );
          console.log('Invoice paid and updated for user:', invoice.customer_email);
        } else {
          console.log('Missing customer email in invoice data.');
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('Subscription created:', subscription);

        if (subscription.customer_email && subscription.id) {
          // Update the user's subscription details
          await User.findOneAndUpdate(
            { email: subscription.customer_email },
            {
              $set: {
                subscriptionID: subscription.id,
                subscriptionStatus: 'active',
                currentPlan: subscription.plan.id,
              },
            }
          );
          console.log('User updated with subscription ID after subscription created.');
        } else {
          console.log('Missing customer email or subscription ID in subscription data.');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const updatedSubscription = event.data.object;
        console.log('Subscription updated:', updatedSubscription);

        if (updatedSubscription.customer_email && updatedSubscription.id) {
          // Update the subscription status in the user's profile
          await User.findOneAndUpdate(
            { email: updatedSubscription.customer_email },
            {
              $set: {
                subscriptionStatus: updatedSubscription.status,
                currentPlan: updatedSubscription.plan.id,
              },
            }
          );
          console.log('User subscription updated successfully.');
        } else {
          console.log('Missing customer email or subscription ID in updated subscription data.');
        }
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object;
        console.log('Charge succeeded:', charge);

        if (charge.billing_details && charge.billing_details.email) {
          // Log or store the charge details
          await User.findOneAndUpdate(
            { email: charge.billing_details.email },
            {
              $push: { charges: charge.id },
            }
          );
          console.log('Charge added to user account:', charge.billing_details.email);
        } else {
          console.log('Missing billing details in charge data.');
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent);

        if (paymentIntent.receipt_email) {
          // Optionally, you could record successful payment intents in your system
          await User.findOneAndUpdate(
            { email: paymentIntent.receipt_email },
            {
              $set: { lastPaymentIntent: paymentIntent.id },
            }
          );
          console.log('Payment intent recorded for user:', paymentIntent.receipt_email);
        } else {
          console.log('Missing receipt email in payment intent data.');
        }
        break;
      }

      // Additional events to handle
      case 'payment_intent.created': {
        console.log('Payment intent created:', event.data.object);
        break;
      }

      case 'invoice.finalized': {
        console.log('Invoice finalized:', event.data.object);
        break;
      }

      case 'invoice.updated': {
        console.log('Invoice updated:', event.data.object);
        break;
      }

      case 'customer.created': {
        const customer = event.data.object;
        console.log('Customer created:', customer);

        if (customer.email) {
          // Optionally create a user in the database if not present
          await User.findOneAndUpdate(
            { email: customer.email },
            {
              $set: {
                stripeCustomerId: customer.id,
                name: customer.name,
                country: customer.address.country,
              },
            },
            { upsert: true } // Creates a new user if one doesn't exist
          );
          console.log('User created or updated:', customer.email);
        } else {
          console.log('Missing email in customer creation data.');
        }
        break;
      }

      case 'customer.updated': {
        const updatedCustomer = event.data.object;
        console.log('Customer updated:', updatedCustomer);

        if (updatedCustomer.email) {
          // Update customer details in the database
          await User.findOneAndUpdate(
            { email: updatedCustomer.email },
            {
              $set: {
                name: updatedCustomer.name,
                address: updatedCustomer.address,
              },
            }
          );
          console.log('Customer details updated for:', updatedCustomer.email);
        } else {
          console.log('Missing email in customer update data.');
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
