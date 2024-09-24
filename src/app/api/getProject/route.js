import connectToDatabase from '@/lib/mongodb';
import Pitch from '@/models/pitch';
import Notification from '@/models/notification';

export const dynamic = 'force-dynamic'; // Force dynamic behavior

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all pitches and populate the entrepreneurId
    const pitches = await Pitch.find({}).populate('entrepreneurId').exec();

    // Extract the investorId from the request's query parameters
    const url = new URL(req.url);
    const investorId = url.searchParams.get('investorId');

    // Process each pitch to determine its status
    const pitchesWithStatus = await Promise.all(
      pitches.map(async (pitch) => {
        let status = 'pending';

        if (investorId) {
          // Check if the investor has a connection request for this pitch
          const connectionRequest = await Notification.findOne({
            investorId: investorId,
            pitchId: pitch._id,
          });

          if (connectionRequest) {
            status = connectionRequest.status; // Use the status from the notification
          }
        }

        return {
          ...pitch.toObject(), // Convert Mongoose object to plain JS object
          status,
        };
      })
    );

    // Return the pitches with status as a JSON response
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
