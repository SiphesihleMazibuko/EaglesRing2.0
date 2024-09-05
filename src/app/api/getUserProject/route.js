import connectToDatabase from '@/lib/mongodb';
import Pitch from '@/models/pitch';

export async function GET(req) {
  try {
    // Get email from the query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    // Check if email is provided
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required to fetch user projects' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Query the database for pitches based on entrepreneurId (email)
    const pitches = await Pitch.find({ entrepreneurId: email }).exec();

    // Return the found pitches
    return new Response(JSON.stringify(pitches), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user pitches:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user pitches' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
