import connectToDatabase from '@/lib/mongodb';
import Pitch from '@/models/pitch';
import Notification from '@/models/notification';

export const dynamic = 'force-dynamic'; 

export async function GET(req) {
  try {
    await connectToDatabase();

    const pitches = await Pitch.find({}).populate('entrepreneurId').exec();

    const url = new URL(req.url);
    const investorId = url.searchParams.get('investorId');

    const pitchesWithStatus = await Promise.all(
      pitches.map(async (pitch) => {
        let status = 'pending';

        if (investorId) {
          const connectionRequest = await Notification.findOne({
            investorId: investorId,
            pitchId: pitch._id,
          });

          if (connectionRequest) {
            status = connectionRequest.status; 
          }
        }

        return {
          ...pitch.toObject(), 
          status,
        };
      })
    );


    return new Response(JSON.stringify(pitchesWithStatus), {
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
