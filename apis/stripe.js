const { CLIENT_REDIRECT_URL, STRIPE_SECRET } = require('../config');
const stripe = require('stripe')(STRIPE_SECRET);

async function createStripeSession(examDetails, exam_id, application_id, applicant_email, org_logo){
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: examDetails.exam_name,
                images: [org_logo],
              },
              unit_amount: parseInt(examDetails.exam_fee)*100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${CLIENT_REDIRECT_URL}/applicants?success=true&application_id=${application_id}&exam_id=${exam_id}&applicant_email=${applicant_email}`,
        cancel_url: `${CLIENT_REDIRECT_URL}/applicants?canceled=true`,
      });

      return { id: session.id };
}

module.exports = {
    createStripeSession
  };