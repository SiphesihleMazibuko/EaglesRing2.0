import connectToDatabase from '@/lib/mongodb';
import Pitch from '@/models/pitch';

export const dynamic = 'force-dynamic'; 

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to the database');

    // Fetch all pitches and populate entrepreneur details
    const pitches = await Pitch.find({})
      .populate('entrepreneurId', 'fullName email') 
      .exec();
    console.log('Fetched pitches:', pitches);

    // Extract investorId from the request URL
    const url = new URL(req.url);
    const investorId = url.searchParams.get('investorId');
    console.log('Investor ID:', investorId);

    // Enrich the pitches with entrepreneur details and investment status
    const enrichedPitches = pitches.map((pitch) => {
      const entrepreneurName = pitch.entrepreneurId?.fullName || 'N/A';
      const entrepreneurEmail = pitch.entrepreneurId?.email || 'N/A';
      console.log('Entrepreneur Name:', entrepreneurName);
      console.log('Entrepreneur Email:', entrepreneurEmail);

      let status = 'pending';
      if (pitch.isInvested) {
        if (pitch.investorId && pitch.investorId.toString() === investorId) {
          status = 'invested';
        } else {
          status = 'invested by others';
        }
      }

      return {
        ...pitch.toObject(),
        entrepreneurName,
        entrepreneurEmail,
        status,
      };
    });

    console.log('Enriched Pitches:', enrichedPitches);

    // Return the enriched pitches as a JSON response
    return new Response(JSON.stringify(enrichedPitches), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching pitches:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pitches' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
