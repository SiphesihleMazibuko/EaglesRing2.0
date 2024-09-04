import connectToDatabase from '@/lib/mongodb';
import Pitch from '@/models/pitch';

export async function GET(req) {
  try {
    await connectToDatabase();

    const pitches = await Pitch.find({}).populate('entrepreneurId').exec();
    
    return new Response(JSON.stringify(pitches), {
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
